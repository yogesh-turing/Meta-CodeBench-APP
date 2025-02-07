const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Set();
    this.rateLimitMap = new Map();
  }

  // Validates input using zod schema
  validateApiKeyInput(email, apiKey) {
    const schema = z.object({
      email: z.string().email(),
      apiKey: z.string().length(32, "API key must be 32 characters long"),
    });

    try {
      schema.parse({ email, apiKey });
      return { success: true };
    } catch (error) {
      return { success: false, errors: error.errors };
    }
  }

  // Generates and registers a new API key
  generateApiKey(email) {
    if (!email) return { success: false, message: "Email is required" };

    const apiKey = crypto.randomBytes(16).toString("hex");
    const id = crypto.randomUUID();
    this.apiKeys.set(email, { id, apiKey, createdAt: new Date() });

    return { success: true, apiKey, userId: id };
  }

  // Authenticates API key and generates a JWT token
  authenticateApiKey(email, apiKey) {
    const user = this.apiKeys.get(email);

    if (!user || user.apiKey !== apiKey) {
      this.updateRateLimit(email);
      const rateLimitStatus = this.checkRateLimit(email);
      if (!rateLimitStatus.success) {
        return rateLimitStatus;
      }
      return { success: false, message: "Invalid API key" };
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, email }, "secretKey", { expiresIn: "1h" });
    return { success: true, token };
  }

  // Revokes a JWT token
  revokeToken(token) {
    this.revokedTokens.add(token);
    return { success: true, message: "Token revoked successfully" };
  }

  // Verifies a JWT token
  verifyToken(token) {
    if (this.revokedTokens.has(token)) {
      return { success: false, message: "Token is revoked" };
    }

    try {
      const decoded = jwt.verify(token, "secretKey");
      return { success: true, decoded };
    } catch (error) {
      return { success: false, message: "Invalid or expired token" };
    }
  }

  // Updates rate limit for a given email
  updateRateLimit(email) {
    const now = new Date();
    const rateLimit = this.rateLimitMap.get(email);

    if (!rateLimit) {
      this.rateLimitMap.set(email, { attempts: 1, lastAttempt: now });
    } else {
      const timeDiff = (now.getTime() - rateLimit.lastAttempt.getTime()) / 1000 / 60; // in minutes

      if (timeDiff < 15) {
        rateLimit.attempts++;
        rateLimit.lastAttempt = now;
      } else {
        rateLimit.attempts = 1;
        rateLimit.lastAttempt = now;
      }

      this.rateLimitMap.set(email, rateLimit);
    }
  }

  // Checks rate limit for a given email
  checkRateLimit(email) {
    const rateLimit = this.rateLimitMap.get(email);

    if (!rateLimit) {
      return { success: true };
    }

    if (rateLimit.attempts >= 5) {
      return { success: false, message: "Rate limit exceeded. Try again after 15 minutes." };
    }

    return { success: true };
  }
}

module.exports = { ApiAuthService };