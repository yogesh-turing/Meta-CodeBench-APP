const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map(); 
    this.revokedTokens = new Set(); 
    this.rateLimiting = new Map(); // For rate limiting
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
    // Check rate limiting
    const now = Date.now();
    const rateLimit = this.rateLimiting.get(email);
    if (rateLimit && rateLimit.attempts >= 5 && now - rateLimit.timestamp < 15 * 60 * 1000) {
      return { success: false, message: "Too many invalid attempts. Try again later." };
    }

    const user = this.apiKeys.get(email);

    if (!user || user.apiKey !== apiKey) {
      // Update rate limiting
      this.rateLimiting.set(email, {
        attempts: (rateLimit?.attempts || 0) + 1,
        timestamp: now,
      });
      return { success: false, message: "Invalid API key" };
    }

    // Reset rate limiting on successful authentication
    this.rateLimiting.delete(email);

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
