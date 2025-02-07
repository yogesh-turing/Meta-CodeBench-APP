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

    // Cleanup expired tokens periodically
    setInterval(() => this.cleanupRevokedTokens(), 3600000); // Every hour
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
      const apiKey = crypto.randomBytes(16).toString("hex");
      const id = crypto.randomUUID();
      const hashedApiKey = this.hashApiKey(apiKey);
      
      this.apiKeys.set(email.toLowerCase(), {
        id,
        apiKey: hashedApiKey,
        createdAt: new Date(),
      });

      return { success: true, apiKey, userId: id };
    } catch (error) {
      return { success: false, message: "Error generating API key" };
    }
  }

  authenticateApiKey(email, apiKey) {
    email = email.toLowerCase();
    
    // Check rate limiting
    if (this.isRateLimited(email)) {
      return { success: false, message: "Invalid API key" };
    }

    const user = this.apiKeys.get(email);
    if (!user || !this.verifyApiKey(apiKey, user.apiKey)) {
      this.recordAuthAttempt(email);
      return { success: false, message: "Invalid API key" };
    }

    try {
      const token = jwt.sign(
        { 
          userId: user.id, 
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        "secretKey",
        { expiresIn: "1h" }
      );
      
      return { success: true, token };
    } catch (error) {
      return { success: false, message: "Invalid API key" };
    }
  }

  revokeToken(token) {
    if (!token) return { success: false, message: "Token is required" };
    
    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        this.revokedTokens.add({
          token,
          expiry: new Date(decoded.exp * 1000),
        });
      }
      return { success: true, message: "Token revoked successfully" };
    } catch (error) {
      return { success: false, message: "Token revoked successfully" };
    }
  }

  verifyToken(token) {
    if (!token) {
      return { success: false, message: "Invalid or expired token" };
    }

    if (this.isTokenRevoked(token)) {
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
  private hashApiKey(apiKey) {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  private verifyApiKey(providedKey, storedHash) {
    const hashedKey = this.hashApiKey(providedKey);
    return crypto.timingSafeEqual(
      Buffer.from(hashedKey),
      Buffer.from(storedHash)
    );
  }

  private isRateLimited(email) {
    const attempts = this.authAttempts.get(email) || [];
    const recentAttempts = attempts.filter(
      timestamp => Date.now() - timestamp < this.ATTEMPT_WINDOW
    );
    return recentAttempts.length >= this.MAX_ATTEMPTS;
  }

  private recordAuthAttempt(email) {
    const attempts = this.authAttempts.get(email) || [];
    attempts.push(Date.now());
    this.authAttempts.set(email, attempts);
  }

  private isTokenRevoked(token) {
    return Array.from(this.revokedTokens).some(
      (revoked) => revoked.token === token && revoked.expiry > new Date()
    );
  }

  private cleanupRevokedTokens() {
    const now = new Date();
    this.revokedTokens = new Set(
      Array.from(this.revokedTokens).filter(
        (revoked) => revoked.expiry > now
      )
    );

    // Cleanup old auth attempts
    for (const [email, attempts] of this.authAttempts.entries()) {
      const validAttempts = attempts.filter(
        timestamp => Date.now() - timestamp < this.ATTEMPT_WINDOW
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