const R = require('rambda');

class MolarMassCalculator {
  /**
   * @param {string} formula - The chemical formula to calculate the molar mass for.
   */
  calculate(formula) {
    if (!formula || typeof formula !== 'string') {
      throw new Error('Invalid formula: Formula must be a non-empty string');
    }

    return this.parseFormula(formula);
  }

  /**
   * @param {string} formula - The chemical formula to parse.
   * @param {number} [startIndex=0] - The starting index to parse from.
   * @returns {number} The molar mass of the parsed formula.
   */
  parseFormula(formula, startIndex = 0) {
    let mass = 0;
    let i = startIndex;

    while (i < formula.length) {
      if (formula[i] === '(') {
        // Parse a group
        const group = this.parseGroup(formula, i);
        mass += group.mass * group.multiplier;
        i = group.index;
      } else if (/[A-Z]/.test(formula[i])) {
        // Parse an element
        const element = this.parseElement(formula, i);
        mass += element.mass * element.count;
        i = element.index;
      } else {
        throw new Error('Invalid formula: Unexpected character');
      }
    }

    return mass;
  }

  /**
   * @param {string} formula - The chemical formula to parse.
   * @param {number} index - The starting index to parse from.
   * @returns {{mass: number, multiplier: number, index: number}} The parsed group.
   */
  parseGroup(formula, index) {
    let pc = 1;
    let j = index + 1;

    if (j >= formula.length || formula[j] === ')' || !/[A-Z(]/.test(formula[j])) {
      throw new Error('Invalid formula: Empty or invalid group');
    }

    while (j < formula.length && pc > 0) {
      if (formula[j] === '(') pc++;
      if (formula[j] === ')') pc--;
      j++;
    }

    if (pc !== 0) {
      throw new Error('Invalid formula: Unmatched parentheses');
    }

    const subFormula = formula.slice(index + 1, j - 1);
    const mass = this.parseFormula(subFormula);

    let multiplier = 1;
    let multiplierStr = '';

    while (j < formula.length && /[0-9]/.test(formula[j])) {
      multiplierStr += formula[j];
      j++;
    }

    if (multiplierStr) {
      multiplier = parseInt(multiplierStr, 10);
    }

    return { mass, multiplier, index: j };
  }

  /**
   * @param {string} formula - The chemical formula to parse.
   * @param {number} index - The starting index to parse from.
   * @returns {{mass: number, count: number, index: number}} The parsed element.
   */
  parseElement(formula, index) {
    const element = formula[index];

    if (index + 1 < formula.length && /[a-z]/.test(formula[index + 1])) {
      element += formula[index + 1];
    }

    if (!this.atomicMasses[element]) {
      throw new Error(`Invalid formula: Unknown element ${element}`);
    }

    let count = 1;
    let countStr = '';

    index += element.length;

    while (index < formula.length && /[0-9]/.test(formula[index])) {
      countStr += formula[index];
      index++;
    }

    if (countStr) {
      count = parseInt(countStr, 10);
    }

    return { mass: this.atomicMasses[element], count, index };
  }

  /**
   * A map of atomic masses for each element.
   * @type {Object<string, number>}
   */
  get atomicMasses() {
    return {
      H: 1,
      He: 4,
      Li: 7,
      Be: 9,
      B: 11,
      C: 12,
      N: 14,
      O: 16,
      F: 19,
      Ne: 20,
      Na: 23,
      Mg: 24,
      Al: 27,
      Si: 28,
      P: 31,
      S: 32,
      Cl: 35,
      Ar: 40,
      K: 39,
      Ca: 40,
      Fe: 56,
      Cu: 64,
      Zn: 65,
      Ag: 108,
      Au: 197,
    };
  }
}

module.exports = MolarMassCalculator;