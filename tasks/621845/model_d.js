const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Set();
    this.authAttempts = new Map();
    this.JWT_SECRET = crypto.randomBytes(32).toString('hex');
    this.RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
    this.MAX_AUTH_ATTEMPTS = 5;
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

    // Generate a more secure API key with higher entropy
    const apiKey = crypto.randomBytes(16).toString("hex");
    const id = crypto.randomUUID();
    
    // Store API key with additional metadata
    this.apiKeys.set(email, {
      id,
      apiKey,
      createdAt: new Date(),
      lastUsed: null
    });

    return { success: true, apiKey, userId: id };
  }

  checkRateLimit(email) {
    const now = Date.now();
    const attempts = this.authAttempts.get(email) || [];
    
    // Clean up old attempts
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.RATE_LIMIT_WINDOW
    );
    
    if (recentAttempts.length >= this.MAX_AUTH_ATTEMPTS) {
      return false;
    }
    
    recentAttempts.push(now);
    this.authAttempts.set(email, recentAttempts);
    return true;
  }

  authenticateApiKey(email, apiKey) {
    // Validate inputs
    const validation = this.validateApiKeyInput(email, apiKey);
    if (!validation.success) {
      return { success: false, message: "Invalid input format" };
    }

    // Check rate limit
    if (!this.checkRateLimit(email)) {
      return { 
        success: false, 
        message: "Too many authentication attempts. Please try again later." 
      };
    }

    const user = this.apiKeys.get(email);

    if (!user || user.apiKey !== apiKey) {
      return { success: false, message: "Invalid API key" };
    }

    // Update last used timestamp
    user.lastUsed = new Date();
    this.apiKeys.set(email, user);

    // Generate JWT with additional claims
    const token = jwt.sign(
      { 
        userId: user.id, 
        email,
        iat: Math.floor(Date.now() / 1000)
      },
      this.JWT_SECRET,
      { 
        expiresIn: "1h",
        jwtid: crypto.randomUUID() 
      }
    );

    return { success: true, token };
  }

  revokeToken(token) {
    try {
      // Verify token before revoking
      const decoded = jwt.verify(token, this.JWT_SECRET);
      this.revokedTokens.add(token);
      
      // Schedule cleanup of revoked token after expiration
      const expiresIn = (decoded.exp - decoded.iat) * 1000;
      setTimeout(() => {
        this.revokedTokens.delete(token);
      }, expiresIn);

      return { success: true, message: "Token revoked successfully" };
    } catch (error) {
      return { success: false, message: "Invalid token provided for revocation" };
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
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return { success: true, decoded };
    } catch (error) {
      return { success: false, message: "Invalid or expired token" };
    }
  }

  // Cleanup method for maintenance
  cleanup() {
    const now = Date.now();
    
    // Clean up rate limiting attempts
    for (const [email, attempts] of this.authAttempts.entries()) {
      const validAttempts = attempts.filter(
        timestamp => now - timestamp < this.RATE_LIMIT_WINDOW
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