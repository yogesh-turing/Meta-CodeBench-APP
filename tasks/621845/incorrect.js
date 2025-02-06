const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Map(); // Changed to Map to store revocation timestamp
    this.authAttempts = new Map(); // For rate limiting
    
    // Cleanup intervals
    setInterval(() => this.cleanupRevokedTokens(), 3600000); // Cleanup every hour
    setInterval(() => this.cleanupAuthAttempts(), 900000); // Cleanup every 15 minutes
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
    const emailSchema = z.string().email();
    
    try {
      emailSchema.parse(email);
    } catch (error) {
      return { success: false, message: "Email is required" };
    }

    // Generate a cryptographically secure API key
    const apiKey = crypto.randomBytes(16).toString("hex");
    const id = crypto.randomUUID();
    
    // Hash the API key before storing
    const hashedKey = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");

    this.apiKeys.set(email, {
      id,
      apiKey: hashedKey,
      createdAt: new Date(),
    });

    return { success: true, apiKey, userId: id };
  }

  authenticateApiKey(email, apiKey) {
    // Check rate limiting
    const attempts = this.getAuthAttempts(email);
    if (attempts >= 5) {
      return { success: false, message: "Too many attempts. Please try again later." };
    }

    // Validate input
    const validation = this.validateApiKeyInput(email, apiKey);
    if (!validation.success) {
      this.incrementAuthAttempts(email);
      return { success: false, message: "Invalid API key" };
    }

    const user = this.apiKeys.get(email);
    if (!user) {
      this.incrementAuthAttempts(email);
      return { success: false, message: "Invalid API key" };
    }

    // Hash the provided API key and compare
    const hashedKey = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");

    if (user.apiKey !== hashedKey) {
      this.incrementAuthAttempts(email);
      return { success: false, message: "Invalid API key" };
    }

    // Generate a JWT token with additional claims
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
  }

  revokeToken(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded) {
        return { success: false, message: "Invalid token format" };
      }

      this.revokedTokens.set(token, {
        timestamp: Date.now(),
        exp: decoded.exp,
      });

      return { success: true, message: "Token revoked successfully" };
    } catch (error) {
      return { success: false, message: "Invalid token format" };
    }
  }

  verifyToken(token) {
    if (!token) {
      return { success: false, message: "Token is required" };
    }

    if (this.revokedTokens.has(token)) {
      return { success: false, message: "Token is revoked" };
    }

    try {
      const decoded = jwt.verify(token, "secretKey");
      return { success: true, decoded };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { success: false, message: "Invalid or expired token" };
      }
      return { success: false, message: "Invalid or expired token" };
    }
  }

  // Helper methods for rate limiting
  getAuthAttempts(email) {
    const attempts = this.authAttempts.get(email);
    if (!attempts) return 0;
    
    if (Date.now() - attempts.timestamp > 900000) {
      this.authAttempts.delete(email);
      return 0;
    }
    
    return attempts.count;
  }

  incrementAuthAttempts(email) {
    const currentAttempts = this.authAttempts.get(email);
    if (!currentAttempts) {
      this.authAttempts.set(email, { count: 1, timestamp: Date.now() });
    } else {
      currentAttempts.count += 1;
    }
  }

  // Cleanup methods
  cleanupRevokedTokens() {
    const now = Date.now();
    for (const [token, data] of this.revokedTokens.entries()) {
      if (now >= data.exp * 1000) {
        this.revokedTokens.delete(token);
      }
    }
  }

  cleanupAuthAttempts() {
    const now = Date.now();
    for (const [email, data] of this.authAttempts.entries()) {
      if (now - data.timestamp > 900000) {
        this.authAttempts.delete(email);
      }
    }
  }
}

module.exports = { ApiAuthService };