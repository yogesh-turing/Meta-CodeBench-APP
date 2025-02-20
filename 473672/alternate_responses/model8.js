const R = require('rambda');

class MolarMassCalculator {
  #atomicMasses = {
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
   * Calculates the molar mass of a chemical compound.
   * @param {string} formula - The chemical formula of the compound.
   * @returns {number} The molar mass of the compound.
   */
  calculate(formula) {
    if (!formula || typeof formula !== 'string') {
      throw new Error('Invalid formula: Formula must be a non-empty string');
    }

    return this.#parseFormula(formula);
  }

  /**
   * Parses a chemical formula and calculates its molar mass.
   * @param {string} formula - The chemical formula to parse.
   * @param {number} [startIndex=0] - The index to start parsing from.
   * @returns {number} The molar mass of the formula.
   */
  #parseFormula(formula, startIndex = 0) {
    let mass = 0;
    let i = startIndex;

    while (i < formula.length) {
      if (formula[i] === '(') {
        const groupMass = this.#parseGroup(formula, i);
        i += groupMass.length;
        mass += groupMass.mass;
      } else if (/[A-Z]/.test(formula[i])) {
        const elementMass = this.#parseElement(formula, i);
        i += elementMass.length;
        mass += elementMass.mass;
      } else {
        throw new Error('Invalid formula: Unexpected character');
      }
    }

    return mass;
  }

  /**
   * Parses a group in a chemical formula and calculates its molar mass.
   * @param {string} formula - The chemical formula to parse.
   * @param {number} startIndex - The index to start parsing from.
   * @returns {{mass: number, length: number}} The molar mass and length of the group.
   */
  #parseGroup(formula, startIndex) {
    let mass = 0;
    let i = startIndex + 1;
    let parenthesesCount = 1;

    while (i < formula.length && parenthesesCount > 0) {
      if (formula[i] === '(') {
        parenthesesCount++;
      } else if (formula[i] === ')') {
        parenthesesCount--;
      }
      i++;
    }

    if (parenthesesCount !== 0) {
      throw new Error('Invalid formula: Unmatched parentheses');
    }

    const groupFormula = formula.slice(startIndex + 1, i - 1);
    mass = this.#parseFormula(groupFormula);

    const multiplier = this.#parseMultiplier(formula, i);
    mass *= multiplier.value;
    i += multiplier.length;

    return { mass, length: i - startIndex };
  }

  /**
   * Parses an element in a chemical formula and calculates its molar mass.
   * @param {string} formula - The chemical formula to parse.
   * @param {number} startIndex - The index to start parsing from.
   * @returns {{mass: number, length: number}} The molar mass and length of the element.
   */
  #parseElement(formula, startIndex) {
    let i = startIndex;
    let element = formula[i];

    if (i + 1 < formula.length && /[a-z]/.test(formula[i + 1])) {
      element += formula[i + 1];
      i++;
    }

    if (!this.#atomicMasses[element]) {
      throw new Error(`Invalid formula: Unknown element ${element}`);
    }

    const multiplier = this.#parseMultiplier(formula, i + 1);
    const mass = this.#atomicMasses[element] * multiplier.value;
    i += multiplier.length + 1;

    return { mass, length: i - startIndex };
  }

  /**
   * Parses a multiplier in a chemical formula.
   * @param {string} formula - The chemical formula to parse.
   * @param {number} startIndex - The index to start parsing from.
   * @returns {{value: number, length: number}} The value and length of the multiplier.
   */
  #parseMultiplier(formula, startIndex) {
    let i = startIndex;
    let multiplier = '';

    while (i < formula.length && /[0-9]/.test(formula[i])) {
      multiplier += formula[i];
      i++;
    }

    return { value: R.defaultTo(1, parseInt(multiplier)), length: i - startIndex };
  }
}

module.exports = MolarMassCalculator;