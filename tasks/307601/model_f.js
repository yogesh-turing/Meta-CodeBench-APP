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
    this.userRequests = new Map();
    this.userRoles = new Map();
    this.roleLimits = roleLimits;
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
      }
      this.userPenalties.delete(userId);
    }

    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }

    const userRole = this.userRoles.get(userId) || 'default';
    const roleLimit = this.roleLimits[userRole] || this.maxRequests;

    const userTimestamps = this.userRequests.get(userId);
    userTimestamps.filter(timestamp => timestamp > currentTime - this.timeWindow);

    if (userTimestamps.length < roleLimit) {
      userTimestamps.push(currentTime);
      this.userRequests.set(userId, userTimestamps);
      return true;
    }

    this.userPenalties.set(userId, currentTime + this.penaltyDuration);
    return false;
  }
}

const main = () => {
  // const rateLimiter = new RateLimiter(1, 1000, 1000);
  // const flag1 = rateLimiter.isRequestAllowed('user1'); // First request allowed
  // console.log('flag1', flag1);
  // const flag2 = rateLimiter.isRequestAllowed('user1'); // Second request denied and penalty applied
  // console.log('flag2', flag2);
  // const flag3 = rateLimiter.isRequestAllowed('user1'); // Request denied due to penalty
  // console.log('flag3', flag3);

  // setTimeout(() => {
  //   const flag4 = rateLimiter.isRequestAllowed('user1');
  //   console.log('flag4', flag4);
  // }, 1100);

  const a = [1,2,3,4,5,6,7,8,9,10];
  console.log("A before", a);
  a.filter((item) => item > 5);
  console.log("A after", a);
}

main();

module.exports = {
  RateLimiter
};