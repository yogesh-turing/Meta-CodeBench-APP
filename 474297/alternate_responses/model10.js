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
    const a = this.a;
    const b = this.b;
    const c = this.c;
    if (a === 0) {
      if (b === 0) {
        if (c === 0) {
          return "Infinite solutions";
        } else {
          return "No solution";
        }
      } else {
        return [-c / b];
      }
    } else {
      const squareRoot = Math.sqrt(b * b - 4 * a * c);
      if (squareRoot < 0) {
        const real = -b / (2 * a);
        const imag = squareRoot / (2 * a);
        return [
          { real, imag },
          { real, imag: -imag },
        ];
      } else {
        const x1 = (-b + squareRoot) / (2 * a);
        const x2 = (-b - squareRoot) / (2 * a);
        return [x1, x2];
      }
    }
  }

  solveByFactoring() {
    if (this.a === 0) {
      if (this.b === 0) {
        if (this.c === 0) {
          return "Infinite solutions";
        } else {
          return "No solution";
        }
      } else {
        return [-this.c / this.b];
      }
    } else {
      if (this.b * this.b - 4 * this.a * this.c < 0) {
        throw new Error("Quadratic equation has no real factors");
      }
      if (
        !Number.isInteger(this.a) ||
        !Number.isInteger(this.b) ||
        !Number.isInteger(this.c)
      ) {
        throw new Error("Factoring method requires integer coefficients");
      }
      let factors = [];
      for (let i = 1; i <= Math.abs(this.c); i++) {
        if (this.c % i === 0) {
          factors.push([i, this.c / i]);
          factors.push([-i, -this.c / i]);
        }
      }
      for (let i = 0; i < factors.length; i++) {
        const factor1 = factors[i][0];
        const factor2 = factors[i][1];
        if (
          factor1 + factor2 === this.b &&
          factor1 * factor2 === this.a * this.c
        ) {
          return [-factor1 / this.a, -factor2 / this.a];
        }
      }
    }
  }
}

module.exports = { QuadraticEquationSolver };
