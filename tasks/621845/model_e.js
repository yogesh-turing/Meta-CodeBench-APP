const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ApiAuthError';
    this.code = code;
  }
}

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map();
    this.revokedTokens = new Set();
    this.authAttempts = new Map(); // tracks authentication attempts
    this.MAX_AUTH_ATTEMPTS = 5;
    this.AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
    this.JWT_SECRET = process.env.JWT_SECRET || "secretKey"; // should be set via environment variable
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

      // Generate a cryptographically secure API key
      const apiKey = crypto.randomBytes(16).toString("hex");
      const id = crypto.randomUUID();
      
      // Hash the API key before storing
      const hashedApiKey = this.hashApiKey(apiKey);
      
      this.apiKeys.set(email, {
        id,
        apiKey: hashedApiKey,
        createdAt: new Date()
      });

      return { success: true, apiKey, userId: id };
    } catch (error) {
      return { success: false, message: "Invalid email format" };
    }
  }

  hashApiKey(apiKey) {
    return crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');
  }

  checkRateLimit(email) {
    const now = Date.now();
    const attempts = this.authAttempts.get(email) || [];
    
    // Clean up old attempts
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.AUTH_WINDOW_MS
    );
    
    if (recentAttempts.length >= this.MAX_AUTH_ATTEMPTS) {
      return false;
    }
    
    recentAttempts.push(now);
    this.authAttempts.set(email, recentAttempts);
    return true;
  }

  authenticateApiKey(email, apiKey) {
    try {
      // Validate input
      const validation = this.validateApiKeyInput(email, apiKey);
      if (!validation.success) {
        throw new ApiAuthError("Invalid input format", "INVALID_INPUT");
      }

      // Check rate limit
      if (!this.checkRateLimit(email)) {
        throw new ApiAuthError("Too many authentication attempts", "RATE_LIMIT_EXCEEDED");
      }

      const user = this.apiKeys.get(email);
      const hashedInputKey = this.hashApiKey(apiKey);

      if (!user || user.apiKey !== hashedInputKey) {
        return { success: false, message: "Invalid API key" };
      }

      // Generate JWT with additional claims
      const token = jwt.sign(
        {
          userId: user.id,
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        this.JWT_SECRET,
        {
          expiresIn: "1h",
          jwtid: crypto.randomUUID(), // unique token ID
        }
      );

      return { success: true, token };
    } catch (error) {
      if (error instanceof ApiAuthError) {
        return { success: false, message: error.message, code: error.code };
      }
      return { success: false, message: "Authentication failed" };
    }
  }

  revokeToken(token) {
    try {
      // Verify token before revoking
      const decoded = jwt.verify(token, this.JWT_SECRET);
      this.revokedTokens.add(token);
      
      // Clean up old revoked tokens
      this.cleanupRevokedTokens();
      
      return { success: true, message: "Token revoked successfully" };
    } catch (error) {
      return { success: false, message: "Invalid token" };
    }
  }

  verifyToken(token) {
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

  cleanupRevokedTokens() {
    for (const token of this.revokedTokens) {
      try {
        jwt.verify(token, this.JWT_SECRET);
      } catch (error) {
        // Remove expired tokens from revoked set
        this.revokedTokens.delete(token);
      }
    }
  }
}

module.exports = { ApiAuthService };