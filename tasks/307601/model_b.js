class RateLimiter {
  constructor(maxRequests, timeWindow, penaltyDuration) {
      if (!Number.isInteger(maxRequests) || maxRequests < 0) {
          throw new Error("maxRequests must be a non-negative integer");
      }
      if (!Number.isInteger(timeWindow) || timeWindow <= 0) {
          throw new Error("timeWindow must be a positive integer");
      }
      if (!Number.isInteger(penaltyDuration) || penaltyDuration <= 0) {
          throw new Error("penaltyDuration must be a positive integer");
      }

      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.userRequests = new Map();
      this.userRoles = new Map();
      this.roleLimits = {
          'admin': maxRequests * 2,
          'premium': maxRequests * 1.5,
          'basic': maxRequests
      };
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
      if (typeof userId !== 'string' || userId.trim() === '') {
          throw new Error("Invalid userId");
      }

      if (this.maxRequests === 0) {
          return false;
      }

      const currentTime = Date.now();

      // Check if user is under penalty
      if (this.userPenalties.has(userId)) {
          const penaltyEndTime = this.userPenalties.get(userId);
          if (currentTime < penaltyEndTime) {
              return false;
          }
          // Remove expired penalty
          this.userPenalties.delete(userId);
      }

      // Initialize request timestamps array if not exists
      if (!this.userRequests.has(userId)) {
          this.userRequests.set(userId, []);
      }

      // Get user's role limit
      const userRole = this.userRoles.get(userId);
      const roleLimit = userRole ? this.roleLimits[userRole] : this.maxRequests;

      // Get user's request timestamps and remove expired ones
      let timestamps = this.userRequests.get(userId);
      const windowStart = currentTime - this.timeWindow;
      timestamps = timestamps.filter(timestamp => timestamp > windowStart);
      this.userRequests.set(userId, timestamps);

      // Check if user has exceeded their limit
      if (timestamps.length >= roleLimit) {
          // Apply penalty
          this.userPenalties.set(userId, currentTime + this.penaltyDuration);
          return false;
      }

      // Add current request timestamp
      timestamps.push(currentTime);
      this.userRequests.set(userId, timestamps);
      return true;
  }
}

module.exports = {
  RateLimiter
};