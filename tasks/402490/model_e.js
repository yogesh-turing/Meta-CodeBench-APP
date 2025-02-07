const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Map(); // Changed to Map to store revocation timestamps
    this.authAttempts = new Map(); // For rate limiting
    
    // Start cleanup intervals
    setInterval(() => this.cleanupAuthAttempts(), 15 * 60 * 1000); // 15 minutes
    setInterval(() => this.cleanupRevokedTokens(), 24 * 60 * 60 * 1000); // 24 hours
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

    try {
      // Validate email format
      z.string().email().parse(email);
      
      // Generate a more secure API key (32 bytes = 64 hex characters)
      const apiKey = crypto.randomBytes(16).toString("hex");
      const id = crypto.randomUUID();
      
      this.apiKeys.set(email, {
        id,
        apiKey,
        createdAt: new Date(),
        hashedKey: this.hashApiKey(apiKey)
      });

      return { success: true, apiKey, userId: id };
    } catch (error) {
      return { success: false, message: "Invalid email format" };
    }
  }

  authenticateApiKey(email, apiKey) {
    if (this.isRateLimited(email)) {
      return { success: false, message: "Too many attempts. Please try again later." };
    }

    const validation = this.validateApiKeyInput(email, apiKey);
    if (!validation.success) {
      this.recordAuthAttempt(email);
      return { success: false, message: "Invalid API key" };
    }

    const user = this.apiKeys.get(email);
    if (!user || user.hashedKey !== this.hashApiKey(apiKey)) {
      this.recordAuthAttempt(email);
      return { success: false, message: "Invalid API key" };
    }

    const token = jwt.sign({ userId: user.id, email }, "secretKey", { 
      expiresIn: "1h",
      jwtid: crypto.randomUUID() // Add unique identifier for token
    });
    
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
        jti: decoded.jti
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

  recordAuthAttempt(email) {
    const attempts = this.authAttempts.get(email) || [];
    const now = Date.now();
    attempts.push(now);
    this.authAttempts.set(email, attempts);
  }

  isRateLimited(email) {
    const attempts = this.authAttempts.get(email) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < 15 * 60 * 1000 // 15 minutes
    );
    return recentAttempts.length >= 5;
  }

  cleanupAuthAttempts() {
    const now = Date.now();
    for (const [email, attempts] of this.authAttempts.entries()) {
      const validAttempts = attempts.filter(
        timestamp => now - timestamp < 15 * 60 * 1000
      );
      if (validAttempts.length === 0) {
        this.authAttempts.delete(email);
      } else {
        this.authAttempts.set(email, validAttempts);
      }
    }
  }

  cleanupRevokedTokens() {
    const now = Date.now();
    for (const [token, data] of this.revokedTokens.entries()) {
      if (now - data.timestamp > 24 * 60 * 60 * 1000) { // 24 hours
        this.revokedTokens.delete(token);
      }
    }
  }
}

module.exports = { ApiAuthService };