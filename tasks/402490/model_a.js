const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Set();
    this.authAttempts = new Map(); // Track authentication attempts
    this.MAX_ATTEMPTS = 5;
    this.ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
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
      // Use crypto.randomBytes for cryptographically secure key generation
      const apiKey = crypto.randomBytes(16).toString("hex");
      const id = crypto.randomUUID();
      const hashedApiKey = this.hashApiKey(apiKey);
      
      this.apiKeys.set(email, {
        id,
        apiKey: hashedApiKey,
        createdAt: new Date(),
        lastUsed: new Date()
      });

      return { success: true, apiKey, userId: id };
    } catch (error) {
      return { success: false, message: "Error generating API key" };
    }
  }

  authenticateApiKey(email, apiKey) {
    if (this.isRateLimited(email)) {
      return { success: false, message: "Too many attempts. Please try again later." };
    }

    this.trackAuthAttempt(email);

    const user = this.apiKeys.get(email);
    if (!user || !this.verifyApiKey(apiKey, user.apiKey)) {
      return { success: false, message: "Invalid API key" };
    }

    this.resetAuthAttempts(email);
    const token = jwt.sign({ userId: user.id, email }, "secretKey", { 
      expiresIn: "1h",
      jwtid: crypto.randomUUID() // Add unique identifier for token
    });

    return { success: true, token };
  }

  revokeToken(token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        this.revokedTokens.add(token);
        return { success: true, message: "Token revoked successfully" };
      }
      return { success: false, message: "Invalid token format" };
    } catch (error) {
      return { success: false, message: "Token revocation failed" };
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

  verifyApiKey(providedKey, storedHash) {
    const hashedKey = this.hashApiKey(providedKey);
    return crypto.timingSafeEqual(
      Buffer.from(hashedKey, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  }

  isRateLimited(email) {
    const attempts = this.authAttempts.get(email) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.ATTEMPT_WINDOW
    );
    return recentAttempts.length >= this.MAX_ATTEMPTS;
  }

  trackAuthAttempt(email) {
    const attempts = this.authAttempts.get(email) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.ATTEMPT_WINDOW
    );
    recentAttempts.push(now);
    this.authAttempts.set(email, recentAttempts);
  }

  resetAuthAttempts(email) {
    this.authAttempts.delete(email);
  }

  // Cleanup method to remove expired data (can be called periodically)
  cleanup() {
    const now = Date.now();
    
    // Clean up expired auth attempts
    for (const [email, attempts] of this.authAttempts.entries()) {
      const validAttempts = attempts.filter(
        timestamp => now - timestamp < this.ATTEMPT_WINDOW
      );
      if (validAttempts.length === 0) {
        this.authAttempts.delete(email);
      } else {
        this.authAttempts.set(email, validAttempts);
      }
    }
  }
}

module.exports = { ApiAuthService };