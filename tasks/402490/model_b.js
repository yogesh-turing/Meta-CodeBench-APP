const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Map(); // Changed to Map to store revocation timestamps
    this.authAttempts = new Map(); // For rate limiting
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
      // Validate email format
      z.string().email().parse(email);

      // Generate a more secure API key using crypto.randomBytes
      const apiKey = crypto.randomBytes(16).toString("hex");
      const id = crypto.randomUUID();
      
      // Store API key with additional metadata
      this.apiKeys.set(email, {
        id,
        apiKey: this.hashApiKey(apiKey),
        createdAt: new Date(),
        lastUsed: null
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
      return validation;
    }

    const user = this.apiKeys.get(email);
    if (!user || !this.verifyApiKey(apiKey, user.apiKey)) {
      this.recordAuthAttempt(email);
      return { success: false, message: "Invalid API key" };
    }

    // Update last used timestamp
    user.lastUsed = new Date();
    this.apiKeys.set(email, user);

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, email }, "secretKey", { expiresIn: "1h" });
    return { success: true, token };
  }

  revokeToken(token) {
    if (!token) {
      return { success: false, message: "Token is required" };
    }

    try {
      // Verify token before revoking
      const decoded = jwt.verify(token, "secretKey");
      this.revokedTokens.set(token, {
        revokedAt: Date.now(),
        userId: decoded.userId
      });
      return { success: true, message: "Token revoked successfully" };
    } catch (error) {
      return { success: false, message: "Invalid or expired token" };
    }
  }

  verifyToken(token) {
    if (!token) {
      return { success: false, message: "Token is required" };
    }

    const revokedInfo = this.revokedTokens.get(token);
    if (revokedInfo) {
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
      Buffer.from(hashedKey),
      Buffer.from(storedHash)
    );
  }

  recordAuthAttempt(email) {
    const now = Date.now();
    const attempts = this.authAttempts.get(email) || [];
    
    // Remove attempts outside the window
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.ATTEMPT_WINDOW
    );
    
    recentAttempts.push(now);
    this.authAttempts.set(email, recentAttempts);
  }

  isRateLimited(email) {
    const now = Date.now();
    const attempts = this.authAttempts.get(email) || [];
    
    // Count attempts within the window
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.ATTEMPT_WINDOW
    );
    
    return recentAttempts.length >= this.MAX_ATTEMPTS;
  }
}

module.exports = { ApiAuthService };