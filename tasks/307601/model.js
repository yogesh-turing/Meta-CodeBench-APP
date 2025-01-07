class RateLimiter {
    constructor(maxRequests, timeWindow, penaltyDuration, roleLimits = {}) {
      // Add validations on all parameters
      if (typeof maxRequests !== 'number' || maxRequests <= 0) {
        throw new Error("maxRequests should be a positive number");
      }
      if (typeof timeWindow !== 'number' || timeWindow <= 0) {
        throw new Error("timeWindow should be a positive number");
      }
      if (typeof penaltyDuration !== 'number' || penaltyDuration <= 0) {
        throw new Error("penaltyDuration should be a positive number");
      }
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.userRequests = new Map();
  
      this.userRoles = new Map();
      this.roleLimits = roleLimits || {};
      this.penaltyDuration = penaltyDuration;
      this.userPenalties = new Map();
    }
  
    setUserRole(userId, role) {
      if (typeof userId !== 'string' || userId.trim() === '') {
        throw new Error("Invalid userId");
      }
      if (typeof role !== 'string' || role.trim() === '') {
        throw new Error("Invalid role");
      }
      this.userRoles.set(userId, role);
    }
  
    isRequestAllowed(userId) {
      // Add validations
      if (typeof userId !== 'string' || userId.trim() === '') {
        throw new Error("Invalid userId");
      }
      if (this.maxRequests === 0) {
        return false;
      }
  
      const currentTime = Date.now();
      if (!this.userRequests.has(userId)) {
        this.userRequests.set(userId, []);
      }
  
      // Check if user is under penalty
      if (this.userPenalties.has(userId)) {
        const penaltyEndTime = this.userPenalties.get(userId);
        if (currentTime < penaltyEndTime) {
          return false;
        } else {
          this.userPenalties.delete(userId);
        }
      }
  
      // Get user role
      const userRole = this.userRoles.get(userId) || 'default';
      const roleLimit = this.roleLimits[userRole] || this.maxRequests;
  
      // Remove expired timestamps
      const userTimestamps = this.userRequests.get(userId);
      const validTimestamps = userTimestamps.filter(timestamp => currentTime - timestamp < this.timeWindow);
      this.userRequests.set(userId, validTimestamps);
  
      // Check if user has exceeded rate limit
      if (validTimestamps.length >= roleLimit) {
        this.userPenalties.set(userId, currentTime + this.penaltyDuration);
        return false;
      }
  
      // Add current timestamp to user's request timestamps
      validTimestamps.push(currentTime);
      this.userRequests.set(userId, validTimestamps);
      return true;
    }
  }
  module.exports = {RateLimiter};