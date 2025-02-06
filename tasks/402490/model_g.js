const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Set();
    this.attempts = new Map();
  }

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

  generateApiKey(email) {
    if (!email) return { success: false, message: "Email is required" };

    const apiKey = crypto.randomBytes(16).toString("hex");
    const id = crypto.randomUUID();
    this.apiKeys.set(email, { id, apiKey, createdAt: new Date() });

    return { success: true, apiKey, userId: id };
  }

  authenticateApiKey(email, apiKey) {
    const user = this.apiKeys.get(email);

    if (!user || user.apiKey !== apiKey) {
      this.incrementAttempts(email);
      const attempts = this.getAttempts(email);
      if (attempts >= 5) {
        return {
          success: false,
          message: "Too many invalid attempts. Try again after 15 minutes.",
        };
      }
      return { success: false, message: "Invalid API key" };
    }

    this.resetAttempts(email);

    const token = jwt.sign({ userId: user.id, email }, "secretKey", {
      expiresIn: "1h",
    });
    return { success: true, token };
  }

  revokeToken(token) {
    this.revokedTokens.add(token);
    return { success: true, message: "Token revoked successfully" };
  }

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

  incrementAttempts(email) {
    const now = Date.now();
    const attempt = this.attempts.get(email);
    if (!attempt || attempt.expires < now) {
      this.attempts.set(email, { count: 1, expires: now + 15 * 60 * 1000 });
    } else {
      this.attempts.set(email, { count: attempt.count + 1, expires: attempt.expires });
    }
  }

  getAttempts(email) {
    const attempt = this.attempts.get(email);
    return attempt ? attempt.count : 0;
  }

  resetAttempts(email) {
    this.attempts.delete(email);
  }
}

module.exports = { ApiAuthService };