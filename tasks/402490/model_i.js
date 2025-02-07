const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map(); // email -> { id, apiKey, createdAt }
    this.revokedTokens = new Set(); // store revoked tokens to prevent reuse
    this.rateLimit = new Map(); // email -> { attempts, lastAttempt }
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
      // Check and update rate limit
      const rateLimitEntry = this.rateLimit.get(email);
      if (rateLimitEntry) {
        const now = Date.now();
        const lastAttempt = rateLimitEntry.lastAttempt;
        if (now - lastAttempt < 15 * 60 * 1000 && rateLimitEntry.attempts >= 5) {
          return { success: false, message: "Too many attempts. Try again later." };
        }
        rateLimitEntry.attempts++;
        rateLimitEntry.lastAttempt = now;
      } else {
        this.rateLimit.set(email, { attempts: 1, lastAttempt: Date.now() });
      }

      return { success: false, message: "Invalid API key" };
    }

    // Reset rate limit on successful authentication
    this.rateLimit.delete(email);

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