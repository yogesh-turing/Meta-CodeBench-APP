const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Map(); // Changed to Map to store revocation timestamp
    this.authAttempts = new Map(); // For rate limiting
    
    // Start cleanup intervals
    setInterval(() => this.cleanupRevokedTokens(), 3600000); // Cleanup every hour
    setInterval(() => this.cleanupAuthAttempts(), 900000); // Cleanup every 15 minutes
  }

  validateApiKeyInput(email, apiKey) {
    const schema = z.object({
      email: z.string().email().toLowerCase(),
      apiKey: z.string().length(32, "API key must be 32 characters long")
        .regex(/^[a-f0-9]{32}$/, "API key must contain only hexadecimal characters"),
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

    try {
      const schema = z.string().email().toLowerCase();
      email = schema.parse(email);

      // Generate a cryptographically secure API key
      const apiKey = crypto.randomBytes(16).toString("hex");
      const id = crypto.randomUUID();
      const hashedApiKey = this.hashApiKey(apiKey);

      this.apiKeys.set(email, {
        id,
        apiKey: hashedApiKey,
        createdAt: new Date(),
      });

      return { success: true, apiKey, userId: id };
    } catch (error) {
      return { success: false, message: "Invalid email format" };
    }
  }

  authenticateApiKey(email, apiKey) {
    // Check rate limiting
    if (this.isRateLimited(email)) {
      return { success: false, message: "Too many attempts. Please try again later" };
    }

    // Validate input
    const validation = this.validateApiKeyInput(email, apiKey);
    if (!validation.success) {
      this.recordAuthAttempt(email);
      return { success: false, message: "Invalid API key" };
    }

    const user = this.apiKeys.get(email);
    if (!user || user.apiKey !== this.hashApiKey(apiKey)) {
      this.recordAuthAttempt(email);
      return { success: false, message: "Invalid API key" };
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email, iat: Math.floor(Date.now() / 1000) },
      "secretKey",
      { expiresIn: "1h" }
    );

    return { success: true, token };
  }

  revokeToken(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded) {
        return { success: false, message: "Invalid token format" };
      }

      this.revokedTokens.set(token, {
        timestamp: Date.now(),
        exp: decoded.exp * 1000, // Convert to milliseconds
      });

      return { success: true, message: "Token revoked successfully" };
    } catch (error) {
      return { success: false, message: "Invalid token format" };
    }
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

  // Private helper methods
  hashApiKey(apiKey) {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  isRateLimited(email) {
    const attempts = this.authAttempts.get(email) || [];
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    const recentAttempts = attempts.filter(timestamp => timestamp > fifteenMinutesAgo);
    return recentAttempts.length >= 5;
  }

  recordAuthAttempt(email) {
    const attempts = this.authAttempts.get(email) || [];
    attempts.push(Date.now());
    this.authAttempts.set(email, attempts);
  }

  cleanupRevokedTokens() {
    const now = Date.now();
    for (const [token, data] of this.revokedTokens.entries()) {
      if (now > data.exp) {
        this.revokedTokens.delete(token);
      }
    }
  }

  cleanupAuthAttempts() {
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    for (const [email, attempts] of this.authAttempts.entries()) {
      const validAttempts = attempts.filter(timestamp => timestamp > fifteenMinutesAgo);
      if (validAttempts.length === 0) {
        this.authAttempts.delete(email);
      } else {
        this.authAttempts.set(email, validAttempts);
      }
    }
  }
}

module.exports = { ApiAuthService };