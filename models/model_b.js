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
      this.cleanupInterval = setInterval(() => this.cleanup(), timeWindow);
    }
  
    isRequestAllowed(userId) {
      if (typeof userId !== 'string' || userId.trim() === '') {
        throw new Error("Invalid userId");
      }
  
      const currentTime = Date.now();
      if (!this.userRequests.has(userId)) {
        this.userRequests.set(userId, []);
      }
  
      const timestamps = this.userRequests.get(userId);
      const validTimestamps = timestamps.filter(
        (timestamp) => currentTime - timestamp < this.timeWindow
      );
  
      if (validTimestamps.length < this.maxRequests) {
        validTimestamps.push(currentTime);
        this.userRequests.set(userId, validTimestamps);
        return true;
      }
  
      return false;
    }
  
    cleanup() {
      const currentTime = Date.now();
      for (const [userId, timestamps] of this.userRequests.entries()) {
        const validTimestamps = timestamps.filter(
          (timestamp) => currentTime - timestamp < this.timeWindow
        );
        if (validTimestamps.length === 0) {
          this.userRequests.delete(userId);
        } else {
          this.userRequests.set(userId, validTimestamps);
        }
      }
    }
  
    destroy() {
      clearInterval(this.cleanupInterval);
    }
  }
  
  module.exports = {
    RateLimiter
  };
  // Usage example
  // const rateLimiter = new RateLimiter(3, 10000);
  
  // const testUserId = "user123";
  
  // const intervalId = setInterval(() => {
  //   try {
  //     const allowed = rateLimiter.isRequestAllowed(testUserId);
  //     console.log(allowed ? "Request allowed" : "Request denied");
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     clearInterval(intervalId);
  //     rateLimiter.destroy();
  //   }
  // }, 3000);
  
  // Clean up after 1 minute
  // setTimeout(() => {
  //   clearInterval(intervalId);
  //   rateLimiter.destroy();
  //   console.log("Test completed");
  // }, 60000);
  