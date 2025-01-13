/**
 * Service class handling user authentication, session management, and password validation.
 * Implements rate limiting, password hashing, and JWT-based session tracking.
 * 
 * @class UserAuthService
 */
class UserAuthService {
    /**
     * Initializes the UserAuthService with storage for users, sessions, and authentication attempts.
     * Sets up password validation schema using Zod.
     * 
     * @constructor
     */
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
        this.failedAttempts = new Map();
        
        // Password schema with specific character requirements
        const passwordSchema = z.string()
            .min(8)
            .refine(
                (password) => {
                    const hasUpperCase = /[A-Z]/.test(password);
                    const hasLowerCase = /[a-z]/.test(password);
                    const hasNumber = /\d/.test(password);
                    const hasSpecial = /[!@#$%^&*]/.test(password);
                    return hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
                },
                {
                    message: "Password must contain uppercase, lowercase, number, and special character"
                }
            );
  
        this.userSchema = z.object({
            email: z.string().email(),
            password: passwordSchema
        });
    }
  
    /**
     * Authenticates a user with email and password, handling rate limiting and failed attempts.
     * 
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Promise<Object>} Authentication result with success status and token or error message
     * @throws {z.ZodError} When input validation fails
     */
    async authenticateUser(email, password) {
        try {
            this.userSchema.parse({ email, password });
            
            const user = this.users.get(email);
            if (!user) {
                this.incrementFailedAttempts(email);
                return {
                    success: false,
                    message: 'Invalid credentials'
                };
            }
  
            const attempts = this.failedAttempts.get(email) || { count: 0 };
            if (attempts.count >= 5) {
                return {
                    success: false,
                    message: 'Too many failed attempts. Try again later.',
                    nextAttemptAt: new Date(attempts.lockoutUntil)
                };
            }
  
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                this.incrementFailedAttempts(email);
                return {
                    success: false,
                    message: 'Invalid credentials'
                };
            }
  
            const token = this.createSession(user.id);
            this.failedAttempts.delete(email);
  
            return {
                success: true,
                token
            };
  
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {
                    success: false,
                    errors: error.errors
                };
            }
  
            return {
                success: false,
                message: error.message
            };
        }
    }
  
    /**
     * Tracks and manages failed authentication attempts for rate limiting.
     * Implements a 15-minute lockout after 5 failed attempts.
     * 
     * @param {string} email - User's email address
     * @private
     */
    incrementFailedAttempts(email) {
        const current = this.failedAttempts.get(email) || { count: 0 };
        current.count = (current.count || 0) + 1;
        
        if (current.count >= 5) {
            current.lockoutUntil = Date.now() + (15 * 60 * 1000); // 15 minutes lockout
        }
        
        this.failedAttempts.set(email, current);
    }
  
    /**
     * Adds a new user to the system with validated email and hashed password.
     * 
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Promise<Object>} Result with success status and userId or error message
     * @throws {z.ZodError} When input validation fails
     */
    async addUser(email, password) {
        try {
            this.userSchema.parse({ email, password });
  
            if (this.users.get(email)) {
                return {
                    success: false,
                    message: 'User already exists'
                };
            }
  
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const id = crypto.randomUUID();
            
            this.users.set(email, { 
                id, 
                password: hashedPassword,
                email
            });
  
            return {
                success: true,
                userId: id
            };
  
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {
                    success: false,
                    errors: error.errors
                };
            }
            
            return {
                success: false,
                message: error.message
            };
        }
    }
  
    /**
     * Creates a new session for a user with a JWT token.
     * 
     * @param {string} userId - The ID of the user
     * @returns {string} JWT token for the session
     * @private
     */
    createSession(userId) {
        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
  
        this.sessions.set(token, {
            userId,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
  
        return token;
    }
  
    /**
     * Validates a session token and checks its expiration.
     * 
     * @param {string} token - JWT token to validate
     * @returns {boolean} True if the session is valid, false otherwise
     */
    validateSession(token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            
            const session = this.sessions.get(token);
            if (!session || session.expiresAt < new Date()) {
                this.sessions.delete(token);
                return false;
            }
  
            return true;
        } catch {
            return false;
        }
    }
  }
  
  // Required dependencies
  const bcrypt = require('bcrypt');
  const { z } = require('zod');
  const jwt = require('jsonwebtoken');
  const crypto = require('crypto');
  
  module.exports = { UserAuthService };