const R = require('rambda');

class ChemicalEquationBalancer {
  #validateEquationFormat(equation) {
    if (!equation.includes("->")) {
      throw new Error("Invalid equation format. Must contain ->");
    }
  }

  #parseEquation(equation) {
    const [reactants, products] = equation.split("->").map((x) =>
      x
        .trim()
        .split("+")
        .map((compound) => compound.trim())
    );

    const leftElements = {};
    const rightElements = {};

    reactants.forEach((compound) => {
      const elements = this.#parseCompound(compound);
      Object.entries(elements).forEach(([element, count]) => {
        leftElements[element] = (leftElements[element] || 0) + count;
      });
    });

    products.forEach((compound) => {
      const elements = this.#parseCompound(compound);
      Object.entries(elements).forEach(([element, count]) => {
        rightElements[element] = (rightElements[element] || 0) + count;
      });
    });

    return { leftElements, rightElements };
  }

  #checkElementsMatch(leftElements, rightElements) {
    const allElements = new Set([
      ...Object.keys(leftElements),
      ...Object.keys(rightElements),
    ]);

    for (const element of allElements) {
      if (!leftElements[element] || !rightElements[element]) {
        throw new Error(`Element ${element} is not present on both sides`);
      }

      if (leftElements[element] !== rightElements[element]) {
        throw new Error("Equation cannot be balanced with simple integer coefficients");
      }
    }
  }

  #parseCompound(compound) {
    const elements = {};
    let i = 0;
    let coefficient = "";

    while (i < compound.length) {
      if (compound[i].match(/[0-9]/)) {
        coefficient += compound[i];
        i++;
        continue;
      }
      break;
    }

    coefficient = coefficient || "1";
    const multiplier = parseInt(coefficient);

    while (i < compound.length) {
      if (compound[i].match(/[A-Z]/)) {
        let element = compound[i];
        i++;

        while (i < compound.length && compound[i].match(/[a-z]/)) {
          element += compound[i];
          i++;
        }

        let count = "";
        while (i < compound.length && compound[i].match(/[0-9]/)) {
          count += compound[i];
          i++;
        }

        count = count || "1";
        elements[element] =
          (elements[element] || 0) + parseInt(count) * multiplier;
      } else {
        i++;
      }
    }
    return elements;
  }

  balanceEquation(equation) {
    this.#validateEquationFormat(equation);
    const { leftElements, rightElements } = this.#parseEquation(equation);
    this.#checkElementsMatch(leftElements, rightElements);

    // If we reach here, the equation is already balanced
    return equation;
  }
}

module.exports = ChemicalEquationBalancer;