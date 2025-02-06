const { aStar } = require('./correct');

// Helper function to create a grid of given size filled with 0s
function createEmptyGrid(rows, cols) {
  return Array(rows)
    .fill()
    .map(() => Array(cols).fill(0));
}

describe("A* Pathfinding Algorithm", () => {
  describe("Input Validation", () => {
    test("handles null/undefined inputs", () => {
      expect(aStar(null, { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
      expect(aStar(undefined, { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
      expect(aStar([], { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
      expect(aStar([[]], { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
    });

    test("handles invalid start/end positions", () => {
      const grid = createEmptyGrid(3, 3);
      expect(aStar(grid, null, { x: 1, y: 1 })).toBeNull();
      expect(aStar(grid, { x: 0, y: 0 }, null)).toBeNull();
      expect(aStar(grid, { x: -1, y: 0 }, { x: 1, y: 1 })).toBeNull();
      expect(aStar(grid, { x: 0, y: 0 }, { x: 3, y: 3 })).toBeNull();
    });

    test("handles blocked start/end positions", () => {
      const grid = [
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      expect(aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 })).toBeNull();
    });
  });

  describe("Path Finding", () => {
    test("finds simple direct path", () => {
      const grid = createEmptyGrid(3, 3);
      const path = aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 });
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThan(0);
    });

    test("navigates around obstacles", () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ];
      const path = aStar(grid, { x: 0, y: 0 }, { x: 3, y: 2 });
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThan(0);
      // Path should avoid obstacles
      path.forEach((pos) => {
        expect(grid[pos.y][pos.x]).toBe(0);
      });
    });

    test("returns null when no path exists", () => {
      const grid = [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ];
      expect(aStar(grid, { x: 0, y: 0 }, { x: 0, y: 2 })).toBeNull();
    });

    test("finds optimal path", () => {
      const grid = createEmptyGrid(3, 3);
      const path = aStar(grid, { x: 0, y: 0 }, { x: 1, y: 1 });
      expect(path.length).toBe(3); // Start -> (0,1) -> (1,1) or Start -> (1,0) -> (1,1)
    });

    // to find  path between dense obstacles
    test("finds optimal path between dense obstacles", () => {
      const grid = [
        [0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0],
      ];
      const path = aStar(grid, { x: 0, y: 0 }, { x: 4, y: 4 });
      expect(path.length).toBe(9);
    });

    // to find  path between dense obstacles in a 10x10 grid
    test("finds optimal path between dense obstacles in a 10x10 grid", () => {
      const grid = [
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      ];
      const path = aStar(grid, { x: 0, y: 0 }, { x: 9, y: 9 });
      expect(path.length).toBe(21);
    });

  });

  describe("Movement Patterns", () => {
    test("only allows cardinal directions (no diagonal movement)", () => {
      const grid = createEmptyGrid(3, 3);
      const path = aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 });

      // Check each step only moves in one direction
      for (let i = 1; i < path.length; i++) {
        const dx = Math.abs(path[i].x - path[i - 1].x);
        const dy = Math.abs(path[i].y - path[i - 1].y);
        expect((dx === 1 && dy === 0) || (dx === 0 && dy === 1)).toBe(true);
      }
    });

    test("handles paths requiring all directions", () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0],
      ];
      const path = aStar(grid, { x: 0, y: 0 }, { x: 3, y: 3 });
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThan(0);
    });
  });

  describe("Performance", () => {
    test("handles large grids efficiently", () => {
      jest.setTimeout(5000); // Increase timeout for this test
      const grid = createEmptyGrid(50, 50);
      const start = { x: 0, y: 0 };
      const end = { x: 49, y: 49 };

      const startTime = Date.now();
      const path = aStar(grid, start, end);
      const endTime = Date.now();

      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test("handles dense obstacle patterns", () => {
      const size = 20;
      const grid = createEmptyGrid(size, size);

      // Create maze-like pattern
      for (let i = 0; i < size; i += 2) {
        for (let j = 0; j < size; j += 2) {
          grid[i][j] = 1;
        }
      }

      const path = aStar(grid, { x: 0, y: 0 }, { x: size - 1, y: size - 1 });
      expect(path === null || Array.isArray(path)).toBe(true);
    });
  });

  describe("Edge Case Grid Configurations", () => {
    test("handles single-cell grid", () => {
      const grid = [[0]];
      const path = aStar(grid, { x: 0, y: 0 }, { x: 0, y: 0 });
      expect(path).toEqual([{ x: 0, y: 0 }]);
    });

    test("handles narrow corridor", () => {
      const grid = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];
      const path = aStar(grid, { x: 0, y: 0 }, { x: 2, y: 0 });
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThan(0);
    });

    test("handles irregular grid shapes", () => {
      const grid = [
        [0, 0, 0],
        [0, 0],
        [0, 0, 0, 0],
      ];
      expect(aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 })).toBeNull();
    });
  });
});

