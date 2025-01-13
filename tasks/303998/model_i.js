const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

class UserAuthService {
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
        this.limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // Limit each IP to 100 requests per windowMs
        });
    }

    async authenticateUser(email, password, req) {
        try {
            await this.limiter(req, res, next);
        } catch (error) {
            return {
                success: false,
                message: 'Too many requests. Please try again later.'
            };
        }

        const user = this.users.get(email);
        
        if (!user) {
            return {
                success: false,
                message: 'Invalid email'
            };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return {
                success: false,
                message: 'Invalid password'
            };
        }

        const sessionId = this.generateSessionId();
        this.sessions.set(sessionId, user.id);
        req.session.sessionId = sessionId;

        return {
            success: true,
            userId: user.id
        };
    }

    async addUser(email, password) {
        if (!this.validateEmail(email)) {
            throw new Error('Invalid email');
        }

        if (!this.validatePassword(password)) {
            throw new Error('Invalid password');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = this.generateUserId();
        this.users.set(email, { id, password: hashedPassword });
        return id;
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    generateUserId() {
        return Math.random().toString(36).substr(2, 9);
    }

    generateSessionId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

module.exports = UserAuthService;