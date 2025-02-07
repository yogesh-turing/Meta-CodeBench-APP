const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map(); // Stores API keys with email as key
    this.revokedTokens = new Set(); // Stores revoked JWT tokens
    this.rateLimit = new Map(); // Stores rate limit information for each email
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
    // Check rate limit
    const rateLimitInfo = this.rateLimit.get(email);
    if (rateLimitInfo) {
      const now = Date.now();
      if (now - rateLimitInfo.timestamp < 15 * 60 * 1000) { // 15 minutes
        if (rateLimitInfo.attempts >= 5) {
          return { success: false, message: "Too many invalid attempts. Try again later." };
        }
        rateLimitInfo.attempts++;
      } else {
        this.rateLimit.delete(email);
      }
    } else {
      this.rateLimit.set(email, { timestamp: Date.now(), attempts: 1 });
    }

    const user = this.apiKeys.get(email);

    if (!user || user.apiKey !== apiKey) {
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
}

module.exports = { ApiAuthService };
