class QuadraticEquationSolver {
  constructor(a, b, c) {
    if (
      typeof a !== "number" ||
      typeof b !== "number" ||
      typeof c !== "number"
    ) {
      throw new Error("Coefficients a, b, and c must be numbers");
    }
    this.a = a;
    this.b = b;
    this.c = c;
  }

  solve(method = "quadraticFormula") {
    if (
      !["quadraticFormula", "completingSquare", "factoring"].includes(method)
    ) {
      throw new Error(
        "Unsupported solving method. Supported methods: 'factoring', 'completingSquare', 'quadraticFormula'."
      );
    }
    if (this.b === 0 && this.c !== 0) {
      return "No solution";
    }
    if (this.b === 0 && this.c === 0) {
      return "Infinite solutions";
    }
    return this[method]();
  }

  solveByQuadraticFormula() {
    const discriminant = this.b * this.b - 4 * this.a * this.c;
    if (discriminant < 0) {
      const real = -this.b / (2 * this.a);
      const imag = Math.sqrt(-discriminant) / (2 * this.a);
      return [
        { real, imag },
        { real, imag: -imag },
      ];
    } else if (discriminant === 0) {
      return [-this.b / (2 * this.a)];
    } else {
      const sqrtDiscriminant = Math.sqrt(discriminant);
      return [
        (-this.b + sqrtDiscriminant) / (2 * this.a),
        (-this.b - sqrtDiscriminant) / (2 * this.a),
      ];
    }
  }

  solveByCompletingSquare() {
    const square = (this.b / (2 * this.a)) * (this.b / (2 * this.a));
    const adjustedC = this.c - square;
    if (adjustedC < 0) {
      const real = -this.b / (2 * this.a);
      const imag = Math.sqrt(-adjustedC) / this.a;
      return [
        { real, imag },
        { real, imag: -imag },
      ];
    } else if (adjustedC === 0) {
      return [-this.b / (2 * this.a)];
    } else {
      const sqrtAdjustedC = Math.sqrt(adjustedC);
      return [
        (-this.b + sqrtAdjustedC) / (2 * this.a),
        (-this.b - sqrtAdjustedC) / (2 * this.a),
      ];
    }
  }

  solveByFactoring() {
    if (
      !Number.isInteger(this.a) ||
      !Number.isInteger(this.b) ||
      !Number.isInteger(this.c)
    ) {
      throw new Error("Factoring method requires integer coefficients");
    }
    const discriminant = this.b * this.b - 4 * this.a * this.c;
    if (discriminant < 0) {
      throw new Error("Quadratic equation has no real factors");
    }
    const factors = this.factor(discriminant);
    if (factors === null) {
      throw new Error("Quadratic equation has no real factors");
    }
    const root1 = (-this.b + factors[0]) / (2 * this.a);
    const root2 = (-this.b - factors[1]) / (2 * this.a);
    return [root1, root2];
  }

  factor(n) {
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        return [i, n / i];
      }
    }
    return null;
  }
}

module.exports = { QuadraticEquationSolver };
