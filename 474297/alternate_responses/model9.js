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
      method !== "quadraticFormula" &&
      method !== "completingSquare" &&
      method !== "factoring"
    ) {
      throw new Error(
        `Unsupported solving method. Supported methods: 'factoring', 'completingSquare', 'quadraticFormula'.`
      );
    }

    if (this.a === 0) {
      if (this.b === 0 && this.c !== 0) {
        return "No solution";
      } else if (this.b === 0 && this.c === 0) {
        return "Infinite solutions";
      }
    }

    switch (method) {
      case "quadraticFormula":
        return this.solveByQuadraticFormula();
      case "completingSquare":
        return this.solveByCompletingSquare();
      case "factoring":
        return this.solveByFactoring();
      default:
        throw new Error("Unknown method");
    }
  }

  solveByQuadraticFormula() {
    const discriminant = this.b * this.b - 4 * this.a * this.c;
    if (discriminant < 0) {
      const realPart = -this.b / (2 * this.a);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * this.a);
      return [
        { real: realPart, imag: imaginaryPart },
        { real: realPart, imag: -imaginaryPart },
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

    const newB = b / a;
    const newC = c / a;

    const squarePart = (newB / 2) ** 2;
    const constantPart = newC - squarePart;

    if (constantPart < 0) {
      const realPart = -newB / 2;
      const imaginaryPart = Math.sqrt(-constantPart);
      return [
        { real: realPart, imag: imaginaryPart },
        { real: realPart, imag: -imaginaryPart },
      ];
    } else if (constantPart === 0) {
      return [-newB / 2];
    } else {
      const sqrtConstantPart = Math.sqrt(constantPart);
      return [-newB / 2 + sqrtConstantPart, -newB / 2 - sqrtConstantPart];
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
      if (factor1 + factor2 === this.b) {
        return [-factor1 / this.a, -factor2 / this.a];
      }
    }

    throw new Error("Quadratic equation cannot be factored");
  }
}

module.exports = { QuadraticEquationSolver };
