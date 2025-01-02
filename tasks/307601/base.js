class RateLimiter {
  constructor(maxRequests, timeWindow, penaltyDuration) {
    // TODO - add validations on all parameters
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
    // TODO - add validations
    const currentTime = Date.now();
    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }

    // TODO - get all the user requests
    // Add a dynamic rate-limiting feature based on user roles and a penalty mechanism for users who exceed their limits. 
    // Use userRoles map to store user roles. Define different rate limits for different roles. 
    // Implement a penalty mechanism that temporarily blocks users who exceed their limits.
    // If there are several requests equal to allow max requests in the time window it should return false
    // else return true
  }
}

module.exports = {
    RateLimiter
}