// test/quadraticEquationSolver.test.js
const { QuadraticEquationSolver } = require("./solution"); // Adjust path as needed
const assert = require("assert");

describe("QuadraticEquationSolver", function () {
  describe("Constructor", function () {
    it("should throw an error if any coefficient is not a number", function () {
      assert.throws(
        () => new QuadraticEquationSolver("a", 2, 3),
        /Coefficients a, b, and c must be numbers/
      );
      assert.throws(
        () => new QuadraticEquationSolver(1, "2", 3),
        /Coefficients a, b, and c must be numbers/
      );
      assert.throws(
        () => new QuadraticEquationSolver(1, 2, "3"),
        /Coefficients a, b, and c must be numbers/
      );
    });
  });

  describe("solve method - unsupported method", function () {
    it("should throw an error when using an unsupported solving method", function () {
      const solver = new QuadraticEquationSolver(1, 2, 1);
      assert.throws(
        () => solver.solve("unsupported"),
        /Unsupported solving method/
      );
    });
  });

  describe("Non-quadratic cases (a === 0)", function () {
    it("should return 'No solution' for degenerate equation with b === 0 and c != 0", function () {
      // 0*x^2 + 0*x + 5 = 0
      const solver = new QuadraticEquationSolver(0, 0, 5);
      const result = solver.solve();
      assert.strictEqual(result, "No solution");
    });

    it("should return 'Infinite solutions' for degenerate equation with b === 0 and c === 0", function () {
      // 0*x^2 + 0*x + 0 = 0
      const solver = new QuadraticEquationSolver(0, 0, 0);
      const result = solver.solve();
      assert.strictEqual(result, "Infinite solutions");
    });
  });

  describe("Quadratic equation with positive discriminant", function () {
    // Equation: 2x² + 5x + 2 = 0  → discriminant = 25 - 16 = 9,
    // roots: (-5 + 3)/(4) = -0.5 and (-5 - 3)/(4) = -2.
    const a = 2,
      b = 5,
      c = 2;
    const expectedRoots = [-0.5, -2];

    it("should solve using the quadratic formula", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      const result = solver.solve("quadraticFormula");
      assert.strictEqual(result.length, 2);
      // Allow any order.
      result.forEach((r) => {
        assert(
          Math.abs(r - expectedRoots[0]) < 1e-6 ||
            Math.abs(r - expectedRoots[1]) < 1e-6
        );
      });
    });

    it("should solve using completing the square", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      const result = solver.solve("completingSquare");
      assert.strictEqual(result.length, 2);

      result.forEach((r) => {
        assert(
          Math.abs(r - expectedRoots[0]) < 1e-6 ||
            Math.abs(r - expectedRoots[1]) < 1e-6
        );
      });
    });

    it("should solve using factoring", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      const result = solver.solve("factoring");
      assert.strictEqual(result.length, 2);
      result.forEach((r) => {
        assert(
          Math.abs(r - expectedRoots[0]) < 1e-6 ||
            Math.abs(r - expectedRoots[1]) < 1e-6
        );
      });
    });
  });

  describe("Quadratic equation with zero discriminant", function () {
    // Equation: x² + 4x + 4 = 0  → discriminant = 16 - 16 = 0,
    // unique root: x = -2.
    const a = 1,
      b = 4,
      c = 4;

    it("should solve using the quadratic formula", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      const result = solver.solve("quadraticFormula");
      assert.strictEqual(result.length, 1);
      assert(Math.abs(result[0] + 2) < 1e-6);
    });

    it("should solve using completing the square", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      const result = solver.solve("completingSquare");
      assert.strictEqual(result.length, 1);
      assert(Math.abs(result[0] + 2) < 1e-6);
    });

    it("should solve using factoring", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      const result = solver.solve("factoring");

      assert.strictEqual(result.length, 1);
      assert(Math.abs(result[0] + 2) < 1e-6);
    });
  });

  describe("Quadratic equation with negative discriminant (complex roots)", function () {
    // Equation: x² + 2x + 5 = 0  → discriminant = 4 - 20 = -16,
    // roots: x = -1 ± 2i.
    const a = 1,
      b = 2,
      c = 5;

    it("should solve using the quadratic formula", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      const result = solver.solve("quadraticFormula");
      assert.strictEqual(result.length, 2);
      result.forEach((root) => {
        // Each root should be an object with properties "real" and "imag".
        assert.strictEqual(typeof root, "object");
        assert("real" in root);
        assert("imag" in root);
        // Check real part is -1 and imaginary part magnitude is 2.
        assert(Math.abs(root.real + 1) < 1e-6);
        assert(Math.abs(Math.abs(root.imag) - 2) < 1e-6);
      });
    });

    it("should solve using completing the square", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      const result = solver.solve("completingSquare");
      assert.strictEqual(result.length, 2);
      result.forEach((root) => {
        assert.strictEqual(typeof root, "object");
        assert("real" in root);
        assert("imag" in root);
        assert(Math.abs(root.real + 1) < 1e-6);
        assert(Math.abs(Math.abs(root.imag) - 2) < 1e-6);
      });
    });

    it("should throw an error when using factoring on an equation with negative discriminant", function () {
      const solver = new QuadraticEquationSolver(a, b, c);
      assert.throws(
        () => solver.solve("factoring"),
        /Quadratic equation has no real factors/
      );
    });
  });

  describe("Factoring method with non-integer coefficients", function () {
    it("should throw an error if coefficients are not integers", function () {
      const solver = new QuadraticEquationSolver(0.5, 2, 1);
      assert.throws(
        () => solver.solve("factoring"),
        /Factoring method requires integer coefficients/
      );
    });
  });
});
