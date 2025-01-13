const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const expressSession = require('express-session');
const { check, validationResult } = require('express-validator');

class UserAuthService {
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
        this.limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        });
    }

    async authenticateUser(req, res, email, password) {
        try {
            await this.limiter(req, res);
        } catch {
            return {
                success: false,
                message: 'Too many requests'
            };
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {
                success: false,
                message: 'Invalid input',
                errors: errors.array()
            };
        }

        const user = this.users.get(email);
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }

        const sessionId = Math.random().toString(36).substr(2, 9);
        this.sessions.set(sessionId, user.id);
        req.session.sessionId = sessionId;

        return {
            success: true,
            userId: user.id
        };
    }

    async addUser(req, res, email, password) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {
                success: false,
                message: 'Invalid input',
                errors: errors.array()
            };
        }

        if (this.users.has(email)) {
            return {
                success: false,
                message: 'Email already exists'
            };
        }

        const id = Math.random().toString(36).substr(2, 9);
        const hashedPassword = await bcrypt.hash(password, 10);
        this.users.set(email, { id, password: hashedPassword });

        return {
            success: true,
            userId: id
        };
    }

    validateInput(req) {
        return [
            check('email', 'Email is required').isEmail(),
            check('password', 'Password is required').isLength({ min: 6 })
        ];
    }
}

module.exports = {UserAuthService};