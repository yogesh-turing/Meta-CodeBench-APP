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
    switch (method) {
      case "quadraticFormula":
        return this.solveByQuadraticFormula();
      case "completingSquare":
        return this.solveByCompletingSquare();
      case "factoring":
        return this.solveByFactoring();
      default:
        throw new Error(
          `Unsupported solving method. Supported methods: 'factoring', 'completingSquare', 'quadraticFormula'.`
        );
    }
  }

  solveByQuadraticFormula() {
    const discriminant = this.b ** 2 - 4 * this.a * this.c;
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
      const root1 = (-this.b + Math.sqrt(discriminant)) / (2 * this.a);
      const root2 = (-this.b - Math.sqrt(discriminant)) / (2 * this.a);
      return [root1, root2];
    }
  }

  solveByCompletingSquare() {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = b / (2 * a);
    const e = c / a;
    const f = d ** 2 - e;
    if (f < 0) {
      const real = -d;
      const imag = Math.sqrt(-f);
      return [
        { real, imag },
        { real, imag: -imag },
      ];
    } else if (f === 0) {
      return [-d];
    } else {
      const root1 = -d + Math.sqrt(f);
      const root2 = -d - Math.sqrt(f);
      return [root1, root2];
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
    const discriminant = this.b ** 2 - 4 * this.a * this.c;
    if (discriminant < 0) {
      throw new Error("Quadratic equation has no real factors");
    }
    const factors = [];
    for (let i = 1; i <= Math.sqrt(discriminant); i++) {
      if (discriminant % i === 0) {
        factors.push([i, discriminant / i]);
      }
    }
    for (const [p, q] of factors) {
      if (
        p * q === discriminant &&
        p + q === this.b &&
        p * q === this.a * this.c
      ) {
        return [-p / this.a, -q / this.a];
      }
    }
    throw new Error("Quadratic equation cannot be factored");
  }
}

module.exports = { QuadraticEquationSolver };
