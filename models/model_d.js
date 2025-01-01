class RateLimiter {
    constructor(maxRequests, timeWindow) {
      if (!Number.isInteger(maxRequests) || maxRequests <= 0) {
        throw new Error('maxRequests must be a positive integer');
      }
      if (!Number.isInteger(timeWindow) || timeWindow <= 0) {
        throw new Error('timeWindow must be a positive integer');
      }
  
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.userRequests = new Map();
      this.cleanupInterval = setInterval(() => this.cleanupOldEntries(), timeWindow);
    }
  
    isRequestAllowed(userId) {
      if (typeof userId !== 'string' || userId.trim() === '') {
        throw new Error('Invalid userId');
      }
  
      const currentTime = Date.now();
      const userTimestamps = this.userRequests.get(userId) || [];
  
      // Remove timestamps outside the time window
      while (userTimestamps.length > 0 && currentTime - userTimestamps[0] >= this.timeWindow) {
        userTimestamps.shift();
      }
  
      if (userTimestamps.length < this.maxRequests) {
        userTimestamps.push(currentTime);
        this.userRequests.set(userId, userTimestamps);
        return true;
      }
  
      return false;
    }
  
    cleanupOldEntries() {
      const currentTime = Date.now();
      for (const [userId, timestamps] of this.userRequests.entries()) {
        const validTimestamps = timestamps.filter(timestamp => currentTime - timestamp < this.timeWindow);
        if (validTimestamps.length === 0) {
          this.userRequests.delete(userId);
        } else {
          this.userRequests.set(userId, validTimestamps);
        }
      }
    }
  
    stopCleanup() {
      clearInterval(this.cleanupInterval);
    }
  }
  
//   // Usage example
//   const rateLimiter = new RateLimiter(3, 10000);
  
//   const testUserId = "user123";
  
//   const intervalId = setInterval(() => {
//     try {
//       const allowed = rateLimiter.isRequestAllowed(testUserId);
//       console.log(allowed ? "Request allowed" : "Request denied");
//     } catch (error) {
//       console.error("Error:", error.message);
//       clearInterval(intervalId);
//       rateLimiter.stopCleanup();
//     }
//   }, 3000);
  
//   // Stop the interval after 1 minute
//   setTimeout(() => {
//     clearInterval(intervalId);
//     rateLimiter.stopCleanup();
//     console.log("Test completed");
//   }, 60000);

module.exports = {
    RateLimiter
  };