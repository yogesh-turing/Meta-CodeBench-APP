const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const expressSession = require('express-session');

class UserAuthService {
    constructor() {
        this.users = new Map();
        this.sessionStore = new expressSession.MemoryStore();
        this.rateLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per window per message
        });
    }

    async authenticateUser(email, password, req, res) {
        try {
            // Input validation
            if (!email || !password) {
                return {
                    success: false,
                    message: 'Please provide both email and password'
                };
            }

            // Rate limiting
            this.rateLimiter(req, res, () => {
                // Authenticate user
                const user = this.users.get(email);
                
                if (user) {
                    const isValidPassword = await bcrypt.compare(password, user.password);
                    
                    if (isValidPassword) {
                        // Session management
                        req.session.userId = user.id;
                        req.session.save((err) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                        
                        return {
                            success: true,
                            userId: user.id
                        };
                    }
                }
                
                return {
                    success: false,
                    message: 'Invalid credentials'
                };
            });
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'An error occurred'
            };
        }
    }

    async addUser(email, password) {
        try {
            // Input validation
            if (!email || !password) {
                return {
                    success: false,
                    message: 'Please provide both email and password'
                };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const id = Math.random().toString(36).substr(2, 9);
            this.users.set(email, { id, password: hashedPassword });
            return id;
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'An error occurred'
            };
        }
    }
}

module.exports = {UserAuthService};