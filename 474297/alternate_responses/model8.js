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
    if (method === "quadraticFormula") {
      return this.solveByQuadraticFormula();
    } else if (method === "completingSquare") {
      return this.solveByCompletingSquare();
    } else if (method === "factoring") {
      return this.solveByFactoring();
    } else {
      throw new Error(
        "Unsupported solving method. Supported methods: 'factoring', 'completingSquare', 'quadraticFormula'."
      );
    }
  }

  solveByQuadraticFormula() {
    const discriminant = this.b * this.b - 4 * this.a * this.c;
    if (discriminant < 0) {
      const sqrtDiscriminant = Math.sqrt(-discriminant);
      return [
        { real: -this.b / (2 * this.a), imag: sqrtDiscriminant / (2 * this.a) },
        {
          real: -this.b / (2 * this.a),
          imag: -sqrtDiscriminant / (2 * this.a),
        },
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
      const completingSquare = this.b / this.a;
      const newC = this.c / this.a - (completingSquare * completingSquare) / 4;
      if (newC < 0) {
        const sqrtNewC = Math.sqrt(-newC);
        return [
          { real: -completingSquare / 2, imag: sqrtNewC },
          { real: -completingSquare / 2, imag: -sqrtNewC },
        ];
      } else if (newC === 0) {
        return [-completingSquare / 2];
      } else {
        const sqrtNewC = Math.sqrt(newC);
        return [
          (-completingSquare + 2 * sqrtNewC) / 2,
          (-completingSquare - 2 * sqrtNewC) / 2,
        ];
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
    } else if (this.b === 0) {
      if (this.c === 0) {
        return [0, 0];
      } else if (this.c < 0) {
        return [Math.sqrt(-this.c / this.a), -Math.sqrt(-this.c / this.a)];
      } else {
        throw new Error("Quadratic equation has no real factors");
      }
    } else {
      if (
        Number.isInteger(this.a) &&
        Number.isInteger(this.b) &&
        Number.isInteger(this.c)
      ) {
        const discriminant = this.b * this.b - 4 * this.a * this.c;
        if (discriminant < 0) {
          throw new Error("Quadratic equation has no real factors");
        } else if (discriminant === 0) {
          return [-this.b / (2 * this.a)];
        } else {
          const sqrtDiscriminant = Math.sqrt(discriminant);
          return [
            (-this.b + sqrtDiscriminant) / (2 * this.a),
            (-this.b - sqrtDiscriminant) / (2 * this.a),
          ];
        }
      } else {
        throw new Error("Factoring method requires integer coefficients");
      }
    }
  }
}

module.exports = { QuadraticEquationSolver };
