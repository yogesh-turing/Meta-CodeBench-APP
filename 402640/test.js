const { Solution } = require('./solution');// Import your Solution module

describe('Solution Tests', () => {
  // Tests for sameDiagonal method
  describe('sameDiagonal method', () => {
    test('returns true for positions on the same diagonal', () => {
      expect(Solution.sameDiagonal(0, 0, 7, 7)).toBe(true);
      expect(Solution.sameDiagonal(0, 7, 7, 0)).toBe(true);
      expect(Solution.sameDiagonal(2, 2, 5, 5)).toBe(true);
      expect(Solution.sameDiagonal(2, 2, 0, 4)).toBe(true);
    });

    test('returns false for positions not on the same diagonal', () => {
      expect(Solution.sameDiagonal(0, 0, 7, 6)).toBe(false);
      expect(Solution.sameDiagonal(3, 0, 3, 7)).toBe(false);
      expect(Solution.sameDiagonal(0, 3, 7, 3)).toBe(false);
    });

    test('returns true for the same position', () => {
      expect(Solution.sameDiagonal(0, 0, 0, 0)).toBe(true);
      expect(Solution.sameDiagonal(5, 5, 5, 5)).toBe(true);
    });
  });

  // Tests for isReacheable method
  describe('isReacheable method', () => {
    test('throws an error for null inputs', () => {
      expect(() => Solution.isReacheable(null, 'a1', 1)).toThrow();
      expect(() => Solution.isReacheable('a1', null, 1)).toThrow();
    });

    test('throws an error for invalid position formats', () => {
      expect(() => Solution.isReacheable('z9', 'a1', 1)).toThrow();
      expect(() => Solution.isReacheable('a1', 'i5', 1)).toThrow();
    });

    test('throws an error for negative moves', () => {
      expect(() => Solution.isReacheable('a1', 'b2', -1)).toThrow();
    });

    test('returns true for the same start and end position', () => {
      expect(Solution.isReacheable('f1', 'f1', 0)).toBe(true);
      expect(Solution.isReacheable('a2', 'a2', 5)).toBe(true);
    });

    test('returns true if directly reachable in one move', () => {
      expect(Solution.isReacheable('a1', 'h8', 1)).toBe(true);
      expect(Solution.isReacheable('a1', 'h8', 2)).toBe(true);
    });

    test('returns false for positions not reachable', () => {
      expect(Solution.isReacheable('a1', 'b1', 5)).toBe(false);
      expect(Solution.isReacheable('h8', 'h7', 2)).toBe(false);
      expect(Solution.isReacheable('a1', 'a7', 1)).toBe(false);
      expect(Solution.isReacheable('a1', 'h8', 0)).toBe(false);
    });

    test('returns true for positions reachable in multiple moves', () => {
      expect(Solution.isReacheable('a1', 'b4', 2)).toBe(true);
      expect(Solution.isReacheable('a1', 'b4', 3)).toBe(true);
      expect(Solution.isReacheable('c1', 'f4', 5)).toBe(true);
    });

    test('handles edge boundaries correctly', () => {
      expect(Solution.isReacheable('a1', 'h8', 2)).toBe(true);
      expect(Solution.isReacheable('h1', 'a8', 1)).toBe(true);
      expect(Solution.isReacheable('a1', 'h7', 2)).toBe(false);
    });
  });
});