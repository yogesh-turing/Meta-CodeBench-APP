Base Code:
```javascript
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
```

Prompt:
APIs are critical components in modern applications but are vulnerable to abuse through excessive requests, leading to issues like server overload, denial of service, or unintended costs. Without a mechanism to regulate request frequency, the system can be overwhelmed, causing degraded performance or downtime. To address this, implementing a rate limiter is essential to restrict the number of requests a user can make within a specified time frame, ensuring fair usage and maintaining system stability.

- Add validations to the constructor that maxRequests, penaltyDuration, and timeWindow should be positive number values.
- Complete the function `isRequestAllowed(userId)`:
    - Add validation to the `userId` parameter that userId should be a non-empty string.
    - if maxRequests is zero then it should return false.
    - Add penalty check, if a user is under penalty, their requests should be denied until the penalty period is over.
    - If the penalty period is over, the penalty should be removed.
    - Add role-based rate limiting, different roles have different rate limits, If the user has no role then the default role limit should be applied.
    - Use userTimestamps to store user request timestamps and expired timestamps should be removed.
    - If the number of valid (non-expired) requests is below the role limit, then the current timestamp should be added to the user's request timestamps and it should return true.
    - If the number of valid requests meets or exceeds the role limit, then a penalty should be applied to the user and it should return false.
    - When a user exceeds their rate limit, a penalty should be applied, User requests should be blocked for a specified duration (penaltyDuration).