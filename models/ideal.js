class RateLimiter {
    constructor(maxRequests, timeWindow) {
      if (maxRequests <= 0 || !Number.isInteger(maxRequests)) {
        throw new Error("maxRequests must be a positive integer");
      }
      if (timeWindow <= 0 || !Number.isInteger(timeWindow)) {
        throw new Error("timeWindow must be a positive integer");
      }
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.userRequests = new Map();
    }
  
    isRequestAllowed(userId) {
      if (typeof userId !== 'string' || userId.trim() === '') {
        throw new Error("Invalid userId");
      }
  
      if (this.maxRequests === 0) {
        return false; // Deny all requests when maxRequests is 0
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
        // Remove expired timestamps
        const validTimestamps = timestamps.filter(timestamp => currentTime - timestamp < this.timeWindow);
        if (validTimestamps.length === 0) {
          this.userRequests.delete(userId); // If no valid timestamps, delete user entry
        } else {
          this.userRequests.set(userId, validTimestamps); // Set remaining valid timestamps
        }
      }
    }
  }
  
    module.exports = {
      RateLimiter
    };
  