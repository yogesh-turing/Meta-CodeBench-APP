const { Solution } = require('./solution');

describe("Task Assignment Tests", () => {
  let solution;

  beforeEach(() => {
    solution = new Solution();
  });

  // Basic functionality tests
  describe("Basic Functionality", () => {
    test("Example case 1 - One pill needed", () => {
      expect(solution.taskAssign([3, 5, 8], [4, 6, 7], 1, 2)).toBe(3);
    });

    test("Example case 2 - Two pills available", () => {
      expect(solution.taskAssign([7, 2, 5], [3, 4, 6], 2, 3)).toBe(3);
    });
  });

  // Edge cases
  describe("Edge Cases", () => {
    test("Empty arrays", () => {
      expect(solution.taskAssign([], [], 1, 1)).toBe(0);
    });

    test("No pills available", () => {
      expect(solution.taskAssign([5, 6], [3, 4], 0, 5)).toBe(0);
    });

    test("Zero strength boost", () => {
      expect(solution.taskAssign([2, 3], [1, 2], 3, 0)).toBe(0);
    });

    test("Single task and worker", () => {
      expect(solution.taskAssign([5], [3], 1, 2)).toBe(1);
    });

    test("All tasks equal, all workers equal", () => {
      expect(solution.taskAssign([5, 5, 5], [4, 4, 4], 2, 1)).toBe(2);
    });
  });

  // Boundary conditions
  describe("Boundary Conditions", () => {
    test("Exact strength match, no pills needed", () => {
      expect(solution.taskAssign([1, 2, 3], [1, 2, 3], 0, 1)).toBe(3);
    });

    test("More workers than tasks", () => {
      expect(solution.taskAssign([1, 2], [1, 2, 3, 4], 1, 1)).toBe(2);
    });

    test("More pills than needed", () => {
      expect(solution.taskAssign([2, 3], [1, 2], 10, 1)).toBe(2);
    });
  });

  // Special scenarios
  describe("Special Scenarios", () => {
    test("Large strength differences", () => {
      expect(solution.taskAssign([1, 100], [1, 50], 1, 50)).toBe(2);
    });

    test("Multiple valid solutions with different pill usage", () => {
      expect(solution.taskAssign([3, 3, 3], [2, 2, 4], 2, 1)).toBe(3);
    });

    test("Strength boost exactly matches requirement", () => {
      expect(solution.taskAssign([5, 10], [3, 8], 1, 2)).toBe(2);
    });
  });

  // Performance stress tests
  describe("Performance Tests", () => {
    test("Large input arrays", () => {
      const largeTasks = Array(1000)
        .fill(0)
        .map((_, i) => i + 1);
      const largeWorkers = Array(1000)
        .fill(0)
        .map((_, i) => i);
      expect(solution.taskAssign(largeTasks, largeWorkers, 500, 1)).toBeGreaterThan(0);
    });

    test("Maximum pill usage scenario", () => {
      const tasks = Array(100).fill(10);
      const workers = Array(100).fill(5);
      expect(solution.taskAssign(tasks, workers, 100, 5)).toBe(100);
    });
  });

  // Error handling
  describe("Error Handling", () => {
    test("Negative values in tasks", () => {
      expect(solution.taskAssign([-1, 2, 3], [1, 2, 3], 1, 1)).toBe(2);
    });

    test("Negative values in workers", () => {
      expect(solution.taskAssign([1, 2, 3], [-1, 2, 3], 1, 1)).toBe(2);
    });

    test("Negative pills count", () => {
      expect(solution.taskAssign([1, 2], [1, 2], -1, 1)).toBe(0);
    });

    test("Negative strength boost", () => {
      expect(solution.taskAssign([1, 2], [1, 2], 1, -1)).toBe(0);
    });
  });

  // Corner cases
  describe("Corner Cases", () => {
    test("All tasks harder than all workers even with pills", () => {
      expect(solution.taskAssign([10, 11, 12], [1, 2, 3], 3, 2)).toBe(0);
    });

    test("All workers stronger than all tasks without pills", () => {
      expect(solution.taskAssign([1, 2, 3], [10, 11, 12], 0, 1)).toBe(3);
    });

    test("Single pill can enable multiple assignments through optimal allocation", () => {
      expect(solution.taskAssign([3, 4, 5], [2, 4, 4], 1, 1)).toBe(3);
    });
  });
});