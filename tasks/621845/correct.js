const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map(); // Stores API keys and metadata
    this.revokedTokens = new Set(); // Tracks revoked JWT tokens
    this.failedAttempts = new Map(); // Tracks failed authentication attempts
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

    const apiKey = crypto.randomBytes(16).toString("hex"); // Securely generate API key
    const id = crypto.randomUUID(); // Unique identifier for the user
    this.apiKeys.set(email, { id, apiKey, createdAt: new Date() });

    return { success: true, apiKey, userId: id };
  }

  // Authenticates API key and generates a JWT token with rate limiting
  authenticateApiKey(email, apiKey) {
    const now = Date.now();

    // Rate limiting: Check for too many failed attempts
    const failedInfo = this.failedAttempts.get(email);
    if (failedInfo && failedInfo.lockoutUntil && failedInfo.lockoutUntil > now) {
      return {
        success: false,
        message: `Too many failed attempts. Try again after ${new Date(
          failedInfo.lockoutUntil
        ).toLocaleTimeString()}`,
      };
    }

    const user = this.apiKeys.get(email);

    // Validate API key
    if (!user || user.apiKey !== apiKey) {
      this.registerFailedAttempt(email);
      return { success: false, message: "Invalid API key" };
    }

    // Reset failed attempts on successful authentication
    this.failedAttempts.delete(email);

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, email }, "secretKey", { expiresIn: "1h" });
    return { success: true, token };
  }

  // Registers a failed authentication attempt and enforces rate limiting
  registerFailedAttempt(email) {
    const now = Date.now();
    const failedInfo = this.failedAttempts.get(email) || { count: 0, lockoutUntil: null };

    failedInfo.count += 1;
    if (failedInfo.count >= 5) {
      failedInfo.lockoutUntil = now + 15 * 60 * 1000; // Lock account for 15 minutes
      failedInfo.count = 0; // Reset attempt count after lockout
    }

    this.failedAttempts.set(email, failedInfo);
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