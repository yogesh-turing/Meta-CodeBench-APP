
class RateLimiter {
  constructor(maxRequests, timeWindowMs, burstSize = 0) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
    this.burstSize = burstSize;
    this.requests = [];
    this.burstCounter = 0;
    this.requestCount = 0;
  }

  isAllowed() {
    this.removeOldRequests();

    if (this.maxRequests === 0) return false;

    if (this.timeWindowMs === 0) {
      if (this.requestCount >= this.maxRequests) {
        return false;
      }
      this.requestCount++;
      return true;
    }

    if (this.burstCounter < this.burstSize) {
      this.burstCounter++;
      this.requests.push(Date.now());
      return true;
    }

    if (this.requests.length < this.maxRequests) {
      this.requests.push(Date.now());
      return true;
    }

    return false;
  }

  removeOldRequests() {
    if (this.timeWindowMs === 0) {
      this.requests = [];
      return;
    }

    const currentTime = Date.now();
    while (
      this.requests.length > 0 &&
      currentTime - this.requests[0] >= this.timeWindowMs
    ) {
      this.requests.shift();
      if (this.burstCounter > 0) {
        this.burstCounter--;
      }
    }
  }
}

module.exports = {RateLimiter};