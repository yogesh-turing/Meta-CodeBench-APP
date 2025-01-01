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
  
      // Cleanup interval to remove expired timestamps
      this.cleanupInterval = setInterval(() => this.cleanup(), timeWindow);
    }
  
    isRequestAllowed(userId) {
      if (typeof userId !== 'string' || userId.trim() === '') {
        throw new Error("Invalid userId");
      }
  
      const currentTime = Date.now();
      const userTimestamps = this.userRequests.get(userId) || [];
      
      // Remove expired timestamps
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
  
    cleanup() {
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
  
    // Method to stop the cleanup interval when the limiter is no longer needed
    stop() {
      clearInterval(this.cleanupInterval);
    }
  }

  module.exports = {
    RateLimiter
  };