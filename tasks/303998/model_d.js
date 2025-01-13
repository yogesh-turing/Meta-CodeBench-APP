const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class UserAuthService {
    constructor() {
        this.users = new Map();
        this.loginAttempts = new Map();
        this.sessions = new Map();
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.MAX_LOGIN_ATTEMPTS = 5;
        this.LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
    }

    async authenticateUser(email, password) {
        if (!this.validateInput(email, password)) {
            return { success: false, message: 'Invalid input' };
        }

        const user = this.users.get(email);
        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }

        if (this.isRateLimited(email)) {
            return { success: false, message: 'Too many failed attempts. Try again later.' };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            this.recordFailedAttempt(email);
            return { success: false, message: 'Invalid credentials' };
        }

        this.resetLoginAttempts(email);
        const token = this.createSession(user.id);
        return { success: true, userId: user.id, token };
    }

    async addUser(email, password) {
        if (!this.validateInput(email, password)) {
            throw new Error('Invalid input');
        }

        if (this.users.has(email)) {
            throw new Error('User already exists');
        }

        const id = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        this.users.set(email, { id, password: hashedPassword });
        return id;
    }

    validateInput(email, password) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && password && password.length >= 8;
    }

    isRateLimited(email) {
        const attempts = this.loginAttempts.get(email);
        if (!attempts) return false;
        return attempts.count >= this.MAX_LOGIN_ATTEMPTS && 
               (Date.now() - attempts.lastAttempt) < this.LOCKOUT_TIME;
    }

    recordFailedAttempt(email) {
        const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
        attempts.count += 1;
        attempts.lastAttempt = Date.now();
        this.loginAttempts.set(email, attempts);
    }

    resetLoginAttempts(email) {
        this.loginAttempts.delete(email);
    }

    createSession(userId) {
        const token = jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '1h' });
        this.sessions.set(userId, token);
        return token;
    }

    verifySession(token) {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            const storedToken = this.sessions.get(decoded.userId);
            return storedToken === token;
        } catch (error) {
            return false;
        }
    }

    logout(userId) {
        this.sessions.delete(userId);
    }
}

module.exports = {UserAuthService};