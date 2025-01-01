class RateLimiter {
    constructor(maxRequests, timeWindow) {
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.userRequests = new Map();
    }
  
    isRequestAllowed(userId) {
      const currentTime = Date.now();
      if (!this.userRequests.has(userId)) {
        this.userRequests.set(userId, []);
      }
  
      const timestamps = this.userRequests.get(userId).filter(
        (timestamp) => currentTime - timestamp < this.timeWindow
      );
  
      if (timestamps.length < this.maxRequests) {
        timestamps.push(currentTime);
        this.userRequests.set(userId, timestamps);
        return true;
      }
  
      return false;
    }
  
    resetUserRequests(userId) {
      this.userRequests.delete(userId);
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