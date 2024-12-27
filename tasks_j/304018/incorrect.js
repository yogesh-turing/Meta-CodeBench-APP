class RateLimiter {
  constructor(maxRequests, timeWindowMs, burstSize = 0) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
    this.burstSize = burstSize;
    this.requests = [];
    this.burstCounter = 0;
  }

  isAllowed() {
    this.removeOldRequests();

    if (this.maxRequests === 0) return false;

    // Handle timeWindowMs = 0 case
    if (this.timeWindowMs === 0) {
      return this.burstCounter < this.burstSize;
    }

    // Check burst allowance first
    if (this.burstCounter < this.burstSize) {
      this.burstCounter++;
      this.requests.push(Date.now());
      return true;
    }

    // Check regular rate limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(Date.now());
      return true;
    }

    return false;
  }

  removeOldRequests() {
    const currentTime = Date.now();
    const cutoffTime = currentTime - this.timeWindowMs;

    // Remove requests outside the time window
    while (this.requests.length > 0 && this.requests[0] <= cutoffTime) {
      this.requests.shift();
    }

    // Reset burst counter if time window has passed
    if (this.requests.length === 0) {
      this.burstCounter = 0;
    }
  }
}

module.exports = {RateLimiter};
