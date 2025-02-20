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
    if (this.a === 0) {
      if (this.b === 0) {
        return this.c === 0 ? "Infinite solutions" : "No solution";
      }
      return [-this.c / this.b];
    }

    const validMethods = ["quadraticFormula", "completingSquare", "factoring"];
    if (!validMethods.includes(method)) {
      throw new Error(
        "Unsupported solving method. Supported methods: 'factoring', 'completingSquare', 'quadraticFormula'."
      );
    }

    switch (method) {
      case "quadraticFormula":
        return this.solveByQuadraticFormula();
      case "completingSquare":
        return this.solveByCompletingSquare();
      case "factoring":
        return this.solveByFactoring();
    }
  }

  calculateDiscriminant() {
    return this.b * this.b - 4 * this.a * this.c;
  }

  solveByQuadraticFormula() {
    const discriminant = this.calculateDiscriminant();

    if (discriminant === 0) {
      return [-this.b / (2 * this.a)];
    }

    if (discriminant > 0) {
      const sqrtDisc = Math.sqrt(discriminant);
      return [
        (-this.b + sqrtDisc) / (2 * this.a),
        (-this.b - sqrtDisc) / (2 * this.a),
      ];
    }

    const realPart = -this.b / (2 * this.a);
    const imagPart = Math.sqrt(-discriminant) / (2 * this.a);
    return [
      { real: realPart, imag: imagPart },
      { real: realPart, imag: -imagPart },
    ];
  }

  solveByCompletingSquare() {
    const h = -this.b / (2 * this.a);
    const k = this.c - (this.b * this.b) / (4 * this.a);
    const discriminant = this.calculateDiscriminant();

    if (discriminant === 0) {
      return [h];
    }

    if (discriminant > 0) {
      const sqrtTerm = Math.sqrt(-k / this.a);
      return [h + sqrtTerm, h - sqrtTerm];
    }

    const imagPart = Math.sqrt(-discriminant) / (2 * this.a);
    return [
      { real: h, imag: imagPart },
      { real: h, imag: -imagPart },
    ];
  }

  solveByFactoring() {
    if (
      !Number.isInteger(this.a) ||
      !Number.isInteger(this.b) ||
      !Number.isInteger(this.c)
    ) {
      throw new Error("Factoring method requires integer coefficients");
    }

    const discriminant = this.calculateDiscriminant();
    if (discriminant < 0) {
      throw new Error("Quadratic equation has no real factors");
    }

    if (discriminant === 0) {
      return [-this.b / (2 * this.a)];
    }

    const sqrtDisc = Math.sqrt(discriminant);
    return [
      (-this.b + sqrtDisc) / (2 * this.a),
      (-this.b - sqrtDisc) / (2 * this.a),
    ];
  }
}

module.exports = { QuadraticEquationSolver };
