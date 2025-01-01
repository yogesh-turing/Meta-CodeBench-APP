class RateLimiter {
    constructor(maxRequests, timeWindow) {
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.userRequests = new Map();
    }
  
    isRequestAllowed(userId) {
      const currentTime = Date.now();
  
      // Get or initialize the queue for the user
      if (!this.userRequests.has(userId)) {
        this.userRequests.set(userId, []);
      }
  
      const timestamps = this.userRequests.get(userId);
  
      // Remove timestamps that are outside the time window
      while (timestamps.length > 0 && currentTime - timestamps[0] > this.timeWindow) {
        timestamps.shift();
      }
  
      // Check if the request should be allowed
      if (timestamps.length < this.maxRequests) {
        timestamps.push(currentTime);
        return true;
      }
  
      return false;
    }
  }
  
//   const rateLimiter = new RateLimiter(3, 10000);
  
//   const testUserId = "user123";
  
//   setInterval(() => {
//     const allowed = rateLimiter.isRequestAllowed(testUserId);
//     console.log(allowed ? "Request allowed" : "Request denied");
//   }, 3000);

module.exports = {
    RateLimiter
  }