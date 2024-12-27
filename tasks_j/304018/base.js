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

    if (this.maxRequests <= 0) return false; //Bug: should be === 0

    if (this.burstCounter < this.burstSize) {
      this.burstCounter++;
      this.requests.push(Date.now());
      return true;
    }

    if (this.requests.length < this.maxRequests) {
      //Bug: Doesn't handle timeWindowMs = 0 correctly
      this.requests.push(Date.now());
      return true;
    }

    return false;
  }

  removeOldRequests() {
    const currentTime = Date.now();
    //Bug: Incorrect comparison operator and missing burst counter reset
    while (
      this.requests.length > 0 &&
      currentTime - this.requests[0] < this.timeWindowMs
    ) {
      this.requests.shift();
    }
    if (this.timeWindowMs === 0) this.requests = [];
  }
}

module.exports = {RateLimiter};
