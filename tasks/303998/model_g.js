const bcrypt = require('bcrypt');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const session = require('express-session');
const Joi = require('joi');

class UserAuthService {
    constructor() {
        this.users = new Map();
        this.rateLimiter = new RateLimiterMemory({
            points: 5, // 5 attempts
            duration: 60, // per minute
            blockDuration: 900 // block for 15 minutes if exceeded
        });
    }

    async authenticateUser(email, password, req) {
        try {
            await this.rateLimiter.consume(email);
        } catch (rateLimiterRes) {
            throw new Error(`Too many attempts. Try again in ${rateLimiterRes.msBeforeNext}ms`);
        }

        const user = this.users.get(email);

        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        req.session.userId = user.id;
        return {
            success: true,
            userId: user.id
        };
    }

    async addUser(email, password) {
        const existingUser = this.users.get(email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = Math.random().toString(36).substr(2, 9);
        this.users.set(email, { id, password: hashedPassword });
        return id;
    }

    validateInput(data) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        });

        return schema.validate(data);
    }
}

module.exports = {UserAuthService};
