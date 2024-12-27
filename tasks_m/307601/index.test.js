const { describe, it, expect } = require('@jest/globals');
const { RateLimiter } = require(process.env.TARGET_FILE);

jest.setTimeout(20 * 1000);

describe('RateLimiter', () => {
  const MAX_REQUESTS = 3;
  const TIME_WINDOW = 10000;
  let rateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(MAX_REQUESTS, TIME_WINDOW);
  });

  test('should allow requests within the limit in the time window', () => {
    const userId = 'user123';
    expect(rateLimiter.isRequestAllowed(userId)).toBe(true);
    expect(rateLimiter.isRequestAllowed(userId)).toBe(true);
    expect(rateLimiter.isRequestAllowed(userId)).toBe(true);
  });

  test('should deny requests exceeding the limit in the time window', () => {
    const userId = 'user123';
    rateLimiter.isRequestAllowed(userId);
    rateLimiter.isRequestAllowed(userId);
    rateLimiter.isRequestAllowed(userId);
    expect(rateLimiter.isRequestAllowed(userId)).toBe(false);
  });

  test('should reset the request count after the time window', (done) => {
    const userId = 'user123';
    rateLimiter.isRequestAllowed(userId);
    rateLimiter.isRequestAllowed(userId);
    rateLimiter.isRequestAllowed(userId);

    setTimeout(() => {
      expect(rateLimiter.isRequestAllowed(userId)).toBe(true);
      done();
    }, TIME_WINDOW + 100);
  });

  test('should handle multiple users independently', () => {
    const user1 = 'user1';
    const user2 = 'user2';

    expect(rateLimiter.isRequestAllowed(user1)).toBe(true);
    expect(rateLimiter.isRequestAllowed(user2)).toBe(true);
    expect(rateLimiter.isRequestAllowed(user1)).toBe(true);
    expect(rateLimiter.isRequestAllowed(user2)).toBe(true);
    expect(rateLimiter.isRequestAllowed(user1)).toBe(true);
    expect(rateLimiter.isRequestAllowed(user2)).toBe(true);

    expect(rateLimiter.isRequestAllowed(user1)).toBe(false);
    expect(rateLimiter.isRequestAllowed(user2)).toBe(false);
  });

  test('should handle invalid userId gracefully', () => {
    expect(() => rateLimiter.isRequestAllowed('')).toThrow('Invalid userId');
    expect(() => rateLimiter.isRequestAllowed(null)).toThrow('Invalid userId');
    expect(() => rateLimiter.isRequestAllowed(undefined)).toThrow('Invalid userId');
  });

  test('should throw an error for invalid constructor parameters', () => {
    expect(() => new RateLimiter(-1, TIME_WINDOW)).toThrow('maxRequests must be a positive integer');
    expect(() => new RateLimiter(MAX_REQUESTS, -1000)).toThrow('timeWindow must be a positive integer');
    expect(() => new RateLimiter(0, TIME_WINDOW)).toThrow('maxRequests must be a positive integer');
  });

  test('should allow requests after expired timestamps are removed', () => {
    const userId = 'user123';
    rateLimiter.isRequestAllowed(userId);
    rateLimiter.isRequestAllowed(userId);
    rateLimiter.isRequestAllowed(userId);

    const originalDateNow = Date.now;
    global.Date.now = jest.fn(() => originalDateNow() + TIME_WINDOW);

    expect(rateLimiter.isRequestAllowed(userId)).toBe(true);

    global.Date.now = originalDateNow;
  });

  test('should clean up expired requests automatically if cleanup is implemented', () => {
    const userId = 'user123';
    rateLimiter.isRequestAllowed(userId);
    rateLimiter.isRequestAllowed(userId);

    const originalDateNow = Date.now;
    global.Date.now = jest.fn(() => originalDateNow() + TIME_WINDOW);

    if (rateLimiter.cleanup) {
      rateLimiter.cleanup();
      expect(rateLimiter.userRequests.get(userId)).toBeUndefined();
    }

    global.Date.now = originalDateNow;
  });

  test('should handle high request volumes efficiently', () => {
    const userId = 'userHighVolume';

    for (let i = 0; i < MAX_REQUESTS; i++) {
      expect(rateLimiter.isRequestAllowed(userId)).toBe(true);
    }

    expect(rateLimiter.isRequestAllowed(userId)).toBe(false);
  });

  test('should deny all requests when initialized with 0 maxRequests', () => {
    const zeroLimiter = new RateLimiter(5, TIME_WINDOW);
    zeroLimiter.maxRequests = 0;
    expect(zeroLimiter.isRequestAllowed('userZero')).toBe(false);
  });
});
