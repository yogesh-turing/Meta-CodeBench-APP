class RateLimiter {
    constructor(maxRequests, timeWindow) {
      if (maxRequests <= 0 || !Number.isInteger(maxRequests)) {
        throw new Error("maxRequests must be a positive integer");
      }
      if (timeWindow <= 0) {
        throw new Error("timeWindow must be a positive number");
      }
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.userRequests = new Map();
    }
  
    isRequestAllowed(userId) {
      if (typeof userId !== 'string' || userId.trim() === '') {
        throw new Error("Invalid userId");
      }
  
      const currentTime = Date.now();
      this.cleanupOldRequests(userId, currentTime);
      const userTimestamps = this.getUserTimestamps(userId);
  
      if (userTimestamps.length < this.maxRequests) {
        this.addNewRequest(userId, currentTime);
        return true;
      }
  
      return false;
    }
  
    cleanupOldRequests(userId, currentTime) {
      if (this.userRequests.has(userId)) {
        const validTimestamps = this.userRequests.get(userId).filter(
          timestamp => currentTime - timestamp < this.timeWindow
        );
        this.userRequests.set(userId, validTimestamps);
      }
    }
  
    getUserTimestamps(userId) {
      return this.userRequests.get(userId) || [];
    }
  
    addNewRequest(userId, timestamp) {
      const userTimestamps = this.getUserTimestamps(userId);
      userTimestamps.push(timestamp);
      this.userRequests.set(userId, userTimestamps);
    }
  }

  module.exports = {
    RateLimiter
  }