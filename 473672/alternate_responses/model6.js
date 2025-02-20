const R = require('rambda');

class MolarMassCalculator {
  /**
   * Constructor to initialize the atomic masses.
   */
  constructor() {
    this.atomicMasses = {
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

  /**
   * Private method to calculate the molar mass of a compound.
   * @param {string} formula - The chemical formula of the compound.
   * @param {number} startIndex - The start index of the formula.
   * @returns {number} The molar mass of the compound.
   */
  _calculateMolarMass(formula, startIndex = 0) {
    let mass = 0;
    let index = startIndex;

    while (index < formula.length) {
      if (formula[index] === '(') {
        const subGroup = this._parseSubGroup(formula, index);
        mass += subGroup.mass;
        index = subGroup.index;
      } else if (/[A-Z]/.test(formula[index])) {
        const element = this._parseElement(formula, index);
        mass += element.mass;
        index = element.index;
      } else {
        throw new Error('Invalid formula: Unexpected character');
      }
    }
    return mass;
  }

  /**
   * Private method to parse a sub group in the formula.
   * @param {string} formula - The chemical formula of the compound.
   * @param {number} index - The current index in the formula.
   * @returns {object} An object containing the mass of the sub group and the new index.
   */
  _parseSubGroup(formula, index) {
    let parenthesisCount = 1;
    let j = index + 1;

    if (j >= formula.length || formula[j] === ')' || !/[A-Z(]/.test(formula[j])) {
      throw new Error('Invalid formula: Empty or invalid group');
    }

    while (j < formula.length && parenthesisCount > 0) {
      if (formula[j] === '(') parenthesisCount++;
      if (formula[j] === ')') parenthesisCount--;
      j++;
    }
    if (parenthesisCount !== 0) {
      throw new Error('Invalid formula: Unmatched parentheses');
    }
    const subGroupFormula = formula.slice(index + 1, j - 1);
    const multiplier = this._parseMultiplier(formula, j);
    const mass = this._calculateMolarMass(subGroupFormula) * multiplier;
    return { mass, index: j + multiplier.toString().length };
  }

  /**
   * Private method to parse an element in the formula.
   * @param {string} formula - The chemical formula of the compound.
   * @param {number} index - The current index in the formula.
   * @returns {object} An object containing the mass of the element and the new index.
   */
  _parseElement(formula, index) {
    let element = formula[index];
    let i = index + 1;

    if (i < formula.length && /[a-z]/.test(formula[i])) {
      element += formula[i];
      i++;
    }
    if (!this.atomicMasses[element]) {
      throw new Error(`Invalid formula: Unknown element ${element}`);
    }
    const multiplier = this._parseMultiplier(formula, i);
    const mass = this.atomicMasses[element] * multiplier;
    return { mass, index: i + multiplier.toString().length };
  }

  /**
   * Private method to parse the multiplier of an element or sub group.
   * @param {string} formula - The chemical formula of the compound.
   * @param {number} index - The current index in the formula.
   * @returns {number} The multiplier.
   */
  _parseMultiplier(formula, index) {
    let multiplier = '';
    let i = index;

    while (i < formula.length && /[0-9]/.test(formula[i])) {
      multiplier += formula[i];
      i++;
    }
    return multiplier ? parseInt(multiplier) : 1;
  }

  /**
   * Public method to calculate the molar mass of a compound.
   * @param {string} formula - The chemical formula of the compound.
   * @returns {number} The molar mass of the compound.
   */
  calculate(formula) {
    if (!formula || typeof formula !== 'string') {
      throw new Error('Invalid formula: Formula must be a non-empty string');
    }
    return this._calculateMolarMass(formula);
  }
}

module.exports = MolarMassCalculator;