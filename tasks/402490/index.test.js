const {ApiAuthService} = require('./model_d');

describe("ApiAuthService", () => {
  let authService;

  beforeEach(() => {
    authService = new ApiAuthService();
  });

  describe("validateApiKeyInput", () => {
    test("should validate correct email and API key", () => {
      const result = authService.validateApiKeyInput("user@example.com", "12345678901234567890123456789012");
      expect(result.success).toBe(true);
    });

    test("should fail for invalid email", () => {
      const result = authService.validateApiKeyInput("invalid-email", "12345678901234567890123456789012");
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    test("should fail for API key with incorrect length", () => {
      const result = authService.validateApiKeyInput("user@example.com", "shortapikey");
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    test("should fail for missing email or API key", () => {
      const result = authService.validateApiKeyInput("", "");
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe("generateApiKey", () => {
    test("should generate an API key for a valid email", () => {
      const result = authService.generateApiKey("user@example.com");
      expect(result.success).toBe(true);
      expect(result.apiKey).toHaveLength(32);
      expect(result.userId).toBeDefined();
    });

    test("should fail if email is not provided", () => {
      const result = authService.generateApiKey("");
      expect(result.success).toBe(false);
      expect(result.message).toBe("Email is required");
    });
  });

  describe("authenticateApiKey", () => {
    test("should authenticate valid API key and generate JWT token", () => {
      const { apiKey } = authService.generateApiKey("user@example.com");
      const result = authService.authenticateApiKey("user@example.com", apiKey);
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });

    test("should fail for incorrect API key", () => {
      authService.generateApiKey("user@example.com");
      const result = authService.authenticateApiKey("user@example.com", "wrongapikey123456789012345678901234");
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid API key");
    });

    test("should fail for non-existent email", () => {
      const result = authService.authenticateApiKey("unknown@example.com", "12345678901234567890123456789012");
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid API key");
    });

    test("should lock out user after 5 failed attempts", () => {
      const email = "user@example.com";
      const { apiKey } = authService.generateApiKey(email);

      for (let i = 0; i < 5; i++) {
        authService.authenticateApiKey(email, "wrongapikey");
      }

      const result = authService.authenticateApiKey(email, apiKey);
      expect(result.success).toBe(false);
    });

    test("should authenticate user after lockout expires", () => {
      jest.useFakeTimers();
      const email = "user@example.com";
      const { apiKey } = authService.generateApiKey(email);

      for (let i = 0; i < 5; i++) {
        authService.authenticateApiKey(email, "wrongapikey");
      }

      jest.advanceTimersByTime(15 * 60 * 1000); // Simulate 15 minutes
      const result = authService.authenticateApiKey(email, apiKey);
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      jest.useRealTimers();
    });
  });

  describe("revokeToken", () => {
    test("should revoke a valid JWT token", () => {
      const { apiKey } = authService.generateApiKey("user@example.com");
      const { token } = authService.authenticateApiKey("user@example.com", apiKey);

      const result = authService.revokeToken(token);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Token revoked successfully");
    });

    test("should allow revoking the same token multiple times", () => {
      const { apiKey } = authService.generateApiKey("user@example.com");
      const { token } = authService.authenticateApiKey("user@example.com", apiKey);

      authService.revokeToken(token);
      const result = authService.revokeToken(token);
      expect(result.success).toBe(true);
    });
  });

  describe("verifyToken", () => {
    test("should verify a valid JWT token", () => {
      const { apiKey } = authService.generateApiKey("user@example.com");
      const { token } = authService.authenticateApiKey("user@example.com", apiKey);

      const result = authService.verifyToken(token);
      expect(result.success).toBe(true);
      expect(result.decoded).toMatchObject({ email: "user@example.com" });
    });

    test("should fail for a revoked token", () => {
      const { apiKey } = authService.generateApiKey("user@example.com");
      const { token } = authService.authenticateApiKey("user@example.com", apiKey);

      authService.revokeToken(token);
      const result = authService.verifyToken(token);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Token is revoked");
    });

    test("should fail for an expired token", () => {
      jest.useFakeTimers();
      const { apiKey } = authService.generateApiKey("user@example.com");
      const { token } = authService.authenticateApiKey("user@example.com", apiKey);

      jest.advanceTimersByTime(1 * 60 * 60 * 1000 + 1); // Simulate 1 hour + 1ms
      const result = authService.verifyToken(token);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid or expired token");
      jest.useRealTimers();
    });
  });

  afterAll(done => {
    // clear the interval
    clearInterval(done);
  })
});
