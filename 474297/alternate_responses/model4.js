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
    // Handle degenerate cases when a === 0
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

  solveByQuadraticFormula() {
    const discriminant = this.b * this.b - 4 * this.a * this.c;

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

    // Complex roots
    const realPart = -this.b / (2 * this.a);
    const imagPart = Math.sqrt(-discriminant) / (2 * this.a);
    return [
      { real: realPart, imag: imagPart },
      { real: realPart, imag: -imagPart },
    ];
  }

  solveByCompletingSquare() {
    // Convert to form: x² + (b/a)x + (c/a) = 0
    const p = this.b / this.a;
    const q = this.c / this.a;

    // Complete the square: x² + px + (p/2)² - (p/2)² + q = 0
    const h = p / 2;
    const k = q - h * h;

    // Solve: (x + h)² = -k
    if (k === 0) {
      return [-h];
    }

    if (k < 0) {
      const sqrtNegK = Math.sqrt(-k);
      return [-h + sqrtNegK, -h - sqrtNegK];
    }

    // Complex roots
    const sqrtK = Math.sqrt(k);
    return [
      { real: -h, imag: sqrtK },
      { real: -h, imag: -sqrtK },
    ];
  }

  solveByFactoring() {
    // Check if coefficients are integers
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

    // Use quadratic formula for factoring
    const sqrtDisc = Math.sqrt(discriminant);
    return [
      (-this.b + sqrtDisc) / (2 * this.a),
      (-this.b - sqrtDisc) / (2 * this.a),
    ];
  }
}

module.exports = { QuadraticEquationSolver };
