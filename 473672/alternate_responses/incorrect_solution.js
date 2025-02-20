const R = require('rambda');

class MolarMassCalculator {
  /**
   * @private
   * @type {Object<string, number>}
   */
  atmas = {
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

  /**
   * @param {string} f
   * @throws {Error} If f is not a non-empty string
   * @throws {Error} If f contains invalid characters or syntax
   * @returns {number}
   */
  calculate(f) {
    if (!f || typeof f !== 'string') {
      throw new Error('Invalid f: F must be a non-empty string');
    }

    return this.parseFormula(f);
  }

  /**
   * @private
   * @param {string} f
   * @param {number} [startIndex=0]
   * @returns {number}
   */
  parseFormula(f, startIndex = 0) {
    let mass = 0;
    let i = startIndex;

    while (i < f.length) {
      if (f[i] === '(') {
        const group = this.parseGroup(f, i);
        mass += group.mass;
        i = group.index;
      } else if (/[A-Z]/.test(f[i])) {
        const element = this.parseElement(f, i);
        mass += element.mass;
        i = element.index;
      } else {
        throw new Error('Invalid f: Unexpected character');
      }
    }

    return mass;
  }

  /**
   * @private
   * @param {string} f
   * @param {number} startIndex
   * @returns {{mass: number, index: number}}
   */
  parseGroup(f, startIndex) {
    let mass = 0;
    let i = startIndex + 1;
    let pc = 1;

    if (i >= f.length || f[i] === ')' || !/[A-Z(]/.test(f[i])) {
      throw new Error('Invalid f: Empty or invalid group');
    }

    while (i < f.length && pc > 0) {
      if (f[i] === '(') pc++;
      if (f[i] === ')') pc--;
      i++;
    }

    if (pc !== 0) {
      throw new Error('Invalid f: Unmatched parentheses');
    }

    const subFormula = f.slice(startIndex + 1, i - 1);
    mass = this.parseFormula(subFormula);

    const multiplier = this.parseMultiplier(f, i);
    mass *= multiplier;

    return { mass, index: i + multiplier.toString().length };
  }

  /**
   * @private
   * @param {string} f
   * @param {number} startIndex
   * @returns {{mass: number, index: number}}
   */
  parseElement(f, startIndex) {
    let element = f[startIndex];
    let i = startIndex + 1;

    if (i < f.length && /[a-z]/.test(f[i])) {
      element += f[i];
      i++;
    }

    if (!this.atmas[element]) {
      throw new Error(`Invalid f: Unknown element ${element}`);
    }

    const count = this.parseMultiplier(f, i);
    const mass = this.atmas[element] * count;

    return { mass, index: i + count.toString().length };
  }

  /**
   * @private
   * @param {string} f
   * @param {number} startIndex
   * @returns {number}
   */
  parseMultiplier(f, startIndex) {
    let multiplier = '';

    while (startIndex < f.length && /[0-9]/.test(f[startIndex])) {
      multiplier += f[startIndex];
      startIndex++;
    }

    return multiplier ? parseInt(multiplier, 10) : 1;
  }
}

module.exports = MolarMassCalculator;