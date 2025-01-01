class RateLimiter {
    constructor(maxRequests, timeWindow) {
      if (!Number.isInteger(maxRequests) || maxRequests <= 0) {
        throw new Error("maxRequests must be a positive integer");
      }
      if (!Number.isInteger(timeWindow) || timeWindow <= 0) {
        throw new Error("timeWindow must be a positive integer");
      }
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.userRequests = new Map();
    }
  
    isRequestAllowed(userId) {
      if (typeof userId !== 'string' || userId.trim() === '') {
        throw new Error("userId must be a non-empty string");
      }
  
      const currentTime = Date.now();
      const userEntry = this.userRequests.get(userId) || { timestamps: [], count: 0 };
  
      // Remove expired timestamps
      while (userEntry.timestamps.length > 0 && currentTime - userEntry.timestamps[0] >= this.timeWindow) {
        userEntry.timestamps.shift();
        userEntry.count--;
      }
  
      if (userEntry.count < this.maxRequests) {
        userEntry.timestamps.push(currentTime);
        userEntry.count++;
        this.userRequests.set(userId, userEntry);
        return true;
      }
  
      return false;
    }
  
    cleanup() {
      const currentTime = Date.now();
      for (const [userId, userEntry] of this.userRequests.entries()) {
        while (userEntry.timestamps.length > 0 && currentTime - userEntry.timestamps[0] >= this.timeWindow) {
          userEntry.timestamps.shift();
          userEntry.count--;
        }
        if (userEntry.count === 0) {
          this.userRequests.delete(userId);
        }
      }
    }
  }
  
//   // Example usage
//   const rateLimiter = new RateLimiter(3, 10000);
  
//   const testUserId = "user123";
  
//   setInterval(() => {
//     try {
//       const allowed = rateLimiter.isRequestAllowed(testUserId);
//       console.log(allowed ? "Request allowed" : "Request denied");
//     } catch (error) {
//       console.error("Error:", error.message);
//     }
//   }, 3000);
  
//   // Periodic cleanup to prevent memory leaks
//   setInterval(() => rateLimiter.cleanup(), 60000);

module.exports = {
    RateLimiter
  }

