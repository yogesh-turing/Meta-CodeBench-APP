class RateLimiter {
  constructor(maxRequests, timeWindow, penaltyDuration, roleLimits) {
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
    this.userRequests = new Map();

    this.userRoles = new Map();
    this.roleLimits = roleLimits || {};
    this.penaltyDuration = penaltyDuration;
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
    if (this.userPenalties.has(userId)) {
      const penaltyExpiry = this.userPenalties.get(userId);
      if (currentTime < penaltyExpiry) {
        return false;
      } else {
        this.userPenalties.delete(userId);
      }
    }

    let roleLimit = this.maxRequests;
    if (this.userRoles.has(userId)) {
      const role = this.userRoles.get(userId);
      roleLimit = this.roleLimits[role] || roleLimit;
    }

    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }

    const userTimestamps = this.userRequests.get(userId);
    userTimestamps.filter(timestamp => timestamp > currentTime - this.timeWindow);

    if (userTimestamps.length < roleLimit) {
      userTimestamps.push(currentTime);
      this.userRequests.set(userId, userTimestamps);
      return true;
    } else {
      this.userPenalties.set(userId, currentTime + this.penaltyDuration);
      return false;
    }
  }
}

module.exports = {
  RateLimiter
}