class RateLimiter {
  constructor(maxRequests, timeWindow, penaltyDuration, roleLimits = {}) {
    if (typeof maxRequests !== 'number' || maxRequests <= 0) {
      throw new Error("maxRequests must be a positive number");
    }
    if (typeof timeWindow !== 'number' || timeWindow <= 0) {
      throw new Error("timeWindow must be a positive number");
    }
    if (typeof penaltyDuration !== 'number' || penaltyDuration <= 0) {
      throw new Error("penaltyDuration must be a positive number");
    }

    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.penaltyDuration = penaltyDuration;
    this.userRequests = new Map();
    this.userRoles = new Map();
    this.roleLimits = roleLimits;
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
      return false; // Deny all requests when maxRequests is 0
    }

    const currentTime = Date.now();

    // Check if user is under penalty
    if (this.userPenalties.has(userId)) {
      const penaltyEndTime = this.userPenalties.get(userId);
      if (currentTime < penaltyEndTime) {
        return false; // User is still under penalty
      } else {
        this.userPenalties.delete(userId); // Penalty period is over
      }
    }

    const userTimestamps = this.userRequests.get(userId) || [];
    const userRole = this.userRoles.get(userId) || 'default';
    const roleLimit = this.roleLimits[userRole] || this.maxRequests;

    // Remove expired timestamps
    while (userTimestamps.length > 0 && currentTime - userTimestamps[0] >= this.timeWindow) {
      userTimestamps.shift();
    }

    if (userTimestamps.length < roleLimit) {
      userTimestamps.push(currentTime);
      this.userRequests.set(userId, userTimestamps);
      return true;
    } else {
      // Apply penalty
      this.userPenalties.set(userId, currentTime + this.penaltyDuration);
      return false;
    }
  }
}

module.exports = {
  RateLimiter
}