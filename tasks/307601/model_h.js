class RateLimiter {
  constructor(maxRequests, timeWindow, penaltyDuration, roleLimits = {}) {
    if (typeof maxRequests !== 'number' || maxRequests <= 0) {
      throw new Error('maxRequests must be a positive number');
    }
    if (typeof timeWindow !== 'number' || timeWindow <= 0) {
      throw new Error('timeWindow must be a positive number');
    }
    if (typeof penaltyDuration !== 'number' || penaltyDuration <= 0) {
      throw new Error('penaltyDuration must be a positive number');
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
      throw new Error('Invalid userId');
    }
    if (typeof role !== 'string' || role.trim() === '') {
      throw new Error('Invalid role');
    }
    this.userRoles.set(userId, role);
  }

  isRequestAllowed(userId) {
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid userId');
    }

    if (this.maxRequests === 0) {
      return false;
    }

    const currentTime = Date.now();
    const userRole = this.userRoles.get(userId) || 'default';
    const roleLimit = this.roleLimits[userRole] || this.maxRequests;

    // Check if user is under penalty
    if (this.userPenalties.has(userId)) {
      const penaltyTime = this.userPenalties.get(userId);
      if (currentTime < penaltyTime) {
        return false;
      }
      this.userPenalties.delete(userId);
    }

    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }

    // Remove expired timestamps
    const userTimestamps = this.userRequests.get(userId);
    const expiredTimestamps = userTimestamps.filter(timestamp => currentTime - timestamp > this.timeWindow);
    expiredTimestamps.forEach(timestamp => userTimestamps.splice(userTimestamps.indexOf(timestamp), 1));

    // Check if user has exceeded rate limit
    if (userTimestamps.length >= roleLimit) {
      this.userPenalties.set(userId, currentTime + this.penaltyDuration);
      return false;
    }

    // Add current timestamp to user's request timestamps
    userTimestamps.push(currentTime);
    this.userRequests.set(userId, userTimestamps);

    return true;
  }
}

module.exports = {
  RateLimiter,
};