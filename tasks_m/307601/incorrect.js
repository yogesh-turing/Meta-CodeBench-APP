class RateLimiter {
    constructor(maxRequests, timeWindow) {
      this.maxRequests = maxRequests || -1;
      this.timeWindow = timeWindow || -1;
      this.userRequests = new Map();
    }
  
    isRequestAllowed(userId) {
      if (!userId || this.timeWindow <= 0) {
        return false;
      }
  
      const currentTime = Date.now();
      
      if (!this.userRequests.has(userId)) {
        this.userRequests.set(userId, null);
      }
  
      const timestamps = this.userRequests.get(userId);
  
      if (timestamps === null || timestamps.length >= this.maxRequests) {
        timestamps.push(currentTime);
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
};