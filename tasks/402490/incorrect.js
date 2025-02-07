const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

class ApiAuthService {
  constructor() {
    this.apiKeys = new Map(); // email => { id, apiKey, createdAt }
    this.revokedTokens = new Set(); // token => boolean
    this.attempts = new Map(); // email => { attempts, lastAttemptAt }
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
      // Check if the email has exceeded the rate limit
      const attempts = this.attempts.get(email);
      if (attempts && attempts.attempts >= 5 && attempts.lastAttemptAt + 15 * 60 * 1000 > Date.now()) {
        return { success: false, message: "Too many invalid attempts. Try again later." };
      }

      // Increment attempts count
      if (!attempts) {
        this.attempts.set(email, { attempts: 1, lastAttemptAt: Date.now() });
      } else {
        attempts.attempts++;
        attempts.lastAttemptAt = Date.now();
      }

      return { success: false, message: "Invalid API key" };
    }

    // Reset attempts count
    this.attempts.delete(email);

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