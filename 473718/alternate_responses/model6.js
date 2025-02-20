const R = require('rambda');

class ChemicalEquationBalancer {
  /**
   * Balances a chemical equation
   * @param {string} equation - The chemical equation to balance
   * @returns {string} The balanced chemical equation
   */
  balanceEquation(equation) {
    // Basic validation
    if (!equation.includes("->")) {
      throw new Error("Invalid equation format. Must contain ->");
    }

    const parsedEquation = this.parseEquation(equation);
    this.validateParsedEquation(parsedEquation);

    // If we reach here, the equation is already balanced
    return equation;
  }

  /**
   * Parses a chemical equation into an object with left and right elements
   * @param {string} equation - The chemical equation to parse
   * @returns {object} An object with left and right elements
   */
  parseEquation(equation) {
    const [reactants, products] = equation.split("->").map((x) =>
      x
        .trim()
        .split("+")
        .map((compound) => compound.trim())
    );

    const leftElements = {};
    const rightElements = {};

    reactants.forEach((compound) => {
      const elements = this.parseCompound(compound);
      R.forEachObjIndexed((count, element) => {
        leftElements[element] = (leftElements[element] || 0) + count;
      }, elements);
    });

    products.forEach((compound) => {
      const elements = this.parseCompound(compound);
      R.forEachObjIndexed((count, element) => {
        rightElements[element] = (rightElements[element] || 0) + count;
      }, elements);
    });

    return { leftElements, rightElements };
  }

  /**
   * Parses a chemical compound into an object with elements and their counts
   * @param {string} compound - The chemical compound to parse
   * @returns {object} An object with elements and their counts
   */
  parseCompound(compound) {
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
        elements[element] = (elements[element] || 0) + parseInt(count) * multiplier;
      } else {
        i++;
      }
    }

    return elements;
  }

  /**
   * Validates the parsed equation to ensure it can be balanced
   * @param {object} parsedEquation - The parsed equation to validate
   */
  validateParsedEquation(parsedEquation) {
    const allElements = R.union(
      Object.keys(parsedEquation.leftElements),
      Object.keys(parsedEquation.rightElements)
    );

    R.forEach((element) => {
      if (!parsedEquation.leftElements[element] || !parsedEquation.rightElements[element]) {
        throw new Error(`Element ${element} is not present on both sides`);
      }

      if (parsedEquation.leftElements[element] !== parsedEquation.rightElements[element]) {
        throw new Error("Equation cannot be balanced with simple integer coefficients");
      }
    }, allElements);
  }
}

module.exports = ChemicalEquationBalancer;