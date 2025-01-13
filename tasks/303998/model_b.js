const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

class UserAuthService {
    constructor() {
        this.users = new Map();
        this.loginAttempts = new Map();
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.MAX_LOGIN_ATTEMPTS = 5;
        this.LOCK_TIME = 15 * 60 * 1000; // 15 minutes
    }

    async authenticateUser(email, password) {
        if (!this.isValidInput(email, password)) {
            return { success: false, message: 'Invalid input' };
        }

        if (this.isRateLimited(email)) {
            return { success: false, message: 'Too many failed attempts. Try again later.' };
        }

        const user = this.users.get(email);
        
        if (user && await bcrypt.compare(password, user.password)) {
            this.resetLoginAttempts(email);
            const token = this.generateToken(user.id);
            return { success: true, userId: user.id, token };
        }

        this.incrementLoginAttempts(email);
        return { success: false, message: 'Invalid credentials' };
    }

    async addUser(email, password) {
        if (!this.isValidInput(email, password)) {
            throw new Error('Invalid input');
        }

        if (this.users.has(email)) {
            throw new Error('User already exists');
        }

        const id = Math.random().toString(36).substr(2, 9);
        const hashedPassword = await bcrypt.hash(password, 10);
        this.users.set(email, { id, password: hashedPassword });
        return id;
    }

    isValidInput(email, password) {
        return validator.isEmail(email) && validator.isLength(password, { min: 8 });
    }

    isRateLimited(email) {
        const attempts = this.loginAttempts.get(email);
        if (attempts && attempts.count >= this.MAX_LOGIN_ATTEMPTS && 
            (Date.now() - attempts.lastAttempt) < this.LOCK_TIME) {
            return true;
        }
        return false;
    }

    incrementLoginAttempts(email) {
        const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: Date.now() };
        attempts.count += 1;
        attempts.lastAttempt = Date.now();
        this.loginAttempts.set(email, attempts);
    }

    resetLoginAttempts(email) {
        this.loginAttempts.delete(email);
    }

    generateToken(userId) {
        return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '1h' });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}

module.exports = UserAuthService;