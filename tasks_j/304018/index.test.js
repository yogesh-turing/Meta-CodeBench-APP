const { RateLimiter } = require(process.env.TARGET_FILE);

describe("RateLimiter", () => {
  it("should allow requests within the limit", () => {
    const limiter = new RateLimiter(2, 1000);
    expect(limiter.isAllowed()).toBe(true);
    expect(limiter.isAllowed()).toBe(true);
  });

  it("should handle edge cases with zero time window", () => {
    const limiter = new RateLimiter(2, 0);
    expect(limiter.isAllowed()).toBe(true);
    expect(limiter.isAllowed()).toBe(true);
    expect(limiter.isAllowed()).toBe(false);
  });

  it("should handle burst with zero time window", () => {
    const limiter = new RateLimiter(1, 0, 1); // max 1, window 0ms, burst 1
    expect(limiter.isAllowed()).toBe(true); // first request (uses burst)
    expect(limiter.isAllowed()).toBe(false); // second request (exceeded both burst and regular limit)
  });

  it("should deny requests exceeding the limit", () => {
    const limiter = new RateLimiter(2, 1000);
    expect(limiter.isAllowed()).toBe(true);
    expect(limiter.isAllowed()).toBe(true);
    expect(limiter.isAllowed()).toBe(false);
  });

  it("should allow requests after the time window", (done) => {
    const limiter = new RateLimiter(1, 100);
    expect(limiter.isAllowed()).toBe(true);
    setTimeout(() => {
      expect(limiter.isAllowed()).toBe(true);
      done();
    }, 200);
  });

  it("should handle edge cases with zero requests", () => {
    const limiter = new RateLimiter(0, 1000);
    expect(limiter.isAllowed()).toBe(false);
  });

  

  it("should handle burst correctly", () => {
    const limiter = new RateLimiter(1, 1000, 1); // max 1, window 1000ms, burst 1
    expect(limiter.isAllowed()).toBe(true); // first request (uses burst)
    expect(limiter.isAllowed()).toBe(false); // second request (exceeded both burst and regular limit)
  });

  

  it("should handle burst and zero requests", () => {
    const limiter = new RateLimiter(0, 0, 1);
    expect(limiter.isAllowed()).toBe(false);
  });

  it("should handle burst and zero time window and zero maxRequests", () => {
    const limiter = new RateLimiter(0, 0, 2);
    expect(limiter.isAllowed()).toBe(false);
  });

  it("should handle burst allowance correctly", () => {
    const limiter = new RateLimiter(1, 1000, 1);
    expect(limiter.isAllowed()).toBe(true); // first request (uses burst)
    expect(limiter.isAllowed()).toBe(false); // second request (exceeded both burst and regular limit)
  });

  it("should handle burst counter reset after time window", (done) => {
    const limiter = new RateLimiter(1, 100, 1);
    expect(limiter.isAllowed()).toBe(true); // first request (uses burst)
    expect(limiter.isAllowed()).toBe(false); // second request (exceeded both burst and regular limit)

    setTimeout(() => {
      expect(limiter.isAllowed()).toBe(true); // allowed after time window
      done();
    }, 200);
  });

  it("should handle burst allowance with zero time window", () => {
    const limiter = new RateLimiter(1, 0, 1);
    expect(limiter.isAllowed()).toBe(true); // first request (uses burst)
    expect(limiter.isAllowed()).toBe(false); // second request (exceeded both burst and regular limit)
  });

  it("should handle request count with zero time window", () => {
    const limiter = new RateLimiter(1, 0);
    expect(limiter.isAllowed()).toBe(true); // first request
    expect(limiter.isAllowed()).toBe(false); // second request (exceeded limit)
  });
});