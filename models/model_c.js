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
          const penaltyEnd = this.userPenalties.get(userId);
          if (currentTime < penaltyEnd) {
              return false;
          }
          this.userPenalties.delete(userId);
      }

      // Initialize user requests if not exists
      if (!this.userRequests.has(userId)) {
          this.userRequests.set(userId, []);
      }

      // Clean up expired timestamps
      const validWindow = currentTime - this.timeWindow;
      const userTimestamps = this.userRequests.get(userId).filter(
          timestamp => timestamp > validWindow
      );
      this.userRequests.set(userId, userTimestamps);

      // Get rate limit based on user role
      const userRole = this.userRoles.get(userId);
      const rateLimit = userRole ? this.roleLimits[userRole] : this.maxRequests;

      // Check if user has exceeded their rate limit
      if (userTimestamps.length >= rateLimit) {
          // Apply penalty
          this.userPenalties.set(userId, currentTime + this.penaltyDuration);
          return false;
      }

      // Add current request timestamp
      userTimestamps.push(currentTime);
      this.userRequests.set(userId, userTimestamps);
      return true;
  }
}

module.exports = {
  RateLimiter
};