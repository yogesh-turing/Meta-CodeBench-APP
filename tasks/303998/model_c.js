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
        this.LOCK_TIME = 15 * 60 * 1000; // 15 minutes
    }

    async authenticateUser(email, password) {
        this.validateInput(email, password);

        if (this.isRateLimited(email)) {
            throw new Error('Too many failed attempts. Please try again later.');
        }

        const user = this.users.get(email);
        
        if (!user) {
            this.recordFailedAttempt(email);
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            this.recordFailedAttempt(email);
            throw new Error('Invalid credentials');
        }

        this.resetLoginAttempts(email);

        const token = this.generateToken(user.id);
        this.sessions.set(user.id, token);

        return {
            success: true,
            userId: user.id,
            token: token
        };
    }

    async addUser(email, password) {
        this.validateInput(email, password);

        if (this.users.has(email)) {
            throw new Error('User already exists');
        }

        const id = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        this.users.set(email, { id, password: hashedPassword });
        return id;
    }

    validateInput(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            throw new Error('Invalid email format');
        }
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
    }

    isRateLimited(email) {
        const attempts = this.loginAttempts.get(email);
        if (attempts && attempts.count >= this.MAX_LOGIN_ATTEMPTS && 
            Date.now() - attempts.lastAttempt < this.LOCK_TIME) {
            return true;
        }
        return false;
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

    generateToken(userId) {
        return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '1h' });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    logout(userId) {
        this.sessions.delete(userId);
    }
}

module.exports = {UserAuthService};