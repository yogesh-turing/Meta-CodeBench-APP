const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

class UserAuthService {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.rateLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit each IP to 5 requests per windowMs
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      handler: (request, response, next) => {
        response.status(429).json({
          success: false,
          message: 'Too many login attempts. Please try again later.',
        });
      },
    });
  }

  async authenticateUser(email, password, request, response) {
    // Apply rate limiting
    await new Promise((resolve, reject) => {
      this.rateLimiter(request, response, (next) => {
        resolve();
      });
    });

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required.',
      };
    }

    // Check if user exists
    const user = this.users.get(email);
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    // Compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    // Generate session
    const sessionId = this.generateSessionId();
    this.sessions.set(sessionId, user.id);
    response.cookie('sessionId', sessionId);

    return {
      success: true,
      userId: user.id,
    };
  }

  async addUser(email, password) {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID
    const id = Math.random().toString(36).substr(2, 9);

    // Store user
    this.users.set(email, { id, password: hashedPassword });

    return id;
  }

  generateSessionId() {
    return Math.random().toString(36).substr(2, 9);
  }

  validateSession(request) {
    const sessionId = request.cookies.sessionId;
    if (!sessionId) {
      return false;
    }

    const userId = this.sessions.get(sessionId);
    if (!userId) {
      return false;
    }

    return true;
  }
}

module.exports = UserAuthService;