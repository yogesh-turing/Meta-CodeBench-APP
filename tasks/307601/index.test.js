const { RateLimiter } = require('./correct');

describe('RateLimiter', function() {
  describe('constructor', function() {
    it('should throw an error if maxRequests is not a positive number', function() {
      expect(() => new RateLimiter(0, 1000, 60000)).toThrow(Error);
      expect(() => new RateLimiter(-1, 1000, 60000)).toThrow(Error);
      expect(() => new RateLimiter('a', 1000, 60000)).toThrow(Error);
    });

    it('should throw an error if timeWindow is not a positive number', function() {
      expect(() => new RateLimiter(10, 0, 60000)).toThrow(Error);
      expect(() => new RateLimiter(10, -1, 60000)).toThrow(Error);
      expect(() => new RateLimiter(10, 'a', 60000)).toThrow(Error);
    });

    it('should throw an error if penaltyDuration is not a positive number', function() {
      expect(() => new RateLimiter(10, 1000, 0)).toThrow(Error);
      expect(() => new RateLimiter(10, 1000, -1)).toThrow(Error);
      expect(() => new RateLimiter(10, 1000, 'a')).toThrow(Error);
    });

  });

  describe('setUserRole', function() {
    it('should throw an error if userId is not a non-empty string', function() {
      const rateLimiter = new RateLimiter(10, 1000, 60000);
      expect(() => rateLimiter.setUserRole('', 'admin')).toThrow(Error);
      expect(() => rateLimiter.setUserRole(123, 'admin')).toThrow(Error);
    });

    it('should throw an error if role is not a non-empty string', function() {
      const rateLimiter = new RateLimiter(10, 1000, 60000);
      expect(() => rateLimiter.setUserRole('user1', '')).toThrow(Error);
      expect(() => rateLimiter.setUserRole('user1', 123)).toThrow(Error);
    });

    it('should set the user role correctly', function() {
      const rateLimiter = new RateLimiter(10, 1000, 60000);
      rateLimiter.setUserRole('user1', 'admin');
      expect(rateLimiter.userRoles.get('user1')).toBe('admin');
    });
  });

  describe('isRequestAllowed', function() {
    it('should throw an error if userId is not a non-empty string', function() {
      const rateLimiter = new RateLimiter(10, 1000, 60000);
      expect(() => rateLimiter.isRequestAllowed('')).toThrow(Error);
      expect(() => rateLimiter.isRequestAllowed(123)).toThrow(Error);
    });

    it('should deny all requests if maxRequests is 0', function() {
      const rateLimiter = new RateLimiter(3, 1000, 60000);
      rateLimiter.maxRequests = 0;
      expect(rateLimiter.isRequestAllowed('user1')).toBe(false);
    });

    it('should deny requests if user is under penalty', function(done) {
      const rateLimiter = new RateLimiter(1, 1000, 1000);
      rateLimiter.isRequestAllowed('user1'); // First request allowed
      rateLimiter.isRequestAllowed('user1'); // Second request denied and penalty applied
      expect(rateLimiter.isRequestAllowed('user1')).toBe(false); // Request denied due to penalty

      setTimeout(() => {
        expect(rateLimiter.isRequestAllowed('user1')).toBe(true); // Penalty period over, request allowed
        done();
      }, 1100);
    });

    it('should apply role-based rate limiting', function() {
      const rateLimiter = new RateLimiter(10, 1000, 60000);
      rateLimiter.roleLimits = { admin: 5 };
      rateLimiter.setUserRole('user1', 'admin');

      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isRequestAllowed('user1')).toBe(true);
      }
      expect(rateLimiter.isRequestAllowed('user1')).toBe(false); // Exceeds admin role limit
    });

    it('should apply default role limit if user has no role', function() {
      const rateLimiter = new RateLimiter(3, 1000, 60000);

      for (let i = 0; i < 3; i++) {
        expect(rateLimiter.isRequestAllowed('user1')).toBe(true);
      }
      expect(rateLimiter.isRequestAllowed('user1')).toBe(false); // Exceeds default role limit
    });

    it('should remove expired timestamps', function(done) {
      const rateLimiter = new RateLimiter(2, 1000, 60000);
      rateLimiter.isRequestAllowed('user1'); // First request allowed
      rateLimiter.isRequestAllowed('user1'); // Second request allowed

      setTimeout(() => {
        expect(rateLimiter.isRequestAllowed('user1')).toBe(true); // First timestamp expired, request allowed
        done();
      }, 1100);
    });
  });
});