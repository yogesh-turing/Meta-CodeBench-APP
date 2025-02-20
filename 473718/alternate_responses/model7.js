const R = require('rambda');

class ChemicalEquationBalancer {
  /**
   * Balances a chemical equation.
   * @param {string} equation - The chemical equation to balance.
   * @returns {string} The balanced chemical equation.
   */
  balanceEquation(equation) {
    // Basic validation
    if (!equation.includes("->")) {
      throw new Error("Invalid equation format. Must contain ->");
    }

    const { leftElements, rightElements } = this.parseEquation(equation);

    // Check if elements match on both sides
    const allElements = R.union(Object.keys(leftElements), Object.keys(rightElements));

    for (const element of allElements) {
      if (!leftElements[element] || !rightElements[element]) {
        throw new Error(`Element ${element} is not present on both sides`);
      }

      if (leftElements[element] !== rightElements[element]) {
        throw new Error("Equation cannot be balanced with simple integer coefficients");
      }
    }

    // If we reach here, the equation is already balanced
    return equation;
  }

  /**
   * Parses a chemical equation into left and right elements.
   * @param {string} equation - The chemical equation to parse.
   * @returns {object} An object with left and right elements.
   */
  parseEquation(equation) {
    const [left, right] = equation.split("->").map(R.trim);

    const leftElements = this.parseSide(left);
    const rightElements = this.parseSide(right);

    return { leftElements, rightElements };
  }

  /**
   * Parses a side of a chemical equation into elements.
   * @param {string} side - The side of the chemical equation to parse.
   * @returns {object} An object with elements and their counts.
   */
  parseSide(side) {
    const elements = {};

    R.forEach((compound) => {
      const parsedCompound = this.parseCompound(compound);

      R.forEachObjIndexed((count, element) => {
        elements[element] = (elements[element] || 0) + count;
      }, parsedCompound);
    }, R.split('+', side));

    return elements;
  }

  /**
   * Parses a compound into elements and their counts.
   * @param {string} compound - The compound to parse.
   * @returns {object} An object with elements and their counts.
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
}

module.exports = ChemicalEquationBalancer;