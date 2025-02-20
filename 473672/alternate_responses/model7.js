const R = require('rambda');

class MolarMassCalculator {
  /**
   * Mapping of atomic symbols to their respective atomic masses.
   * @private
   */
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
   * @returns {number} The molar mass of the parsed formula.
   * @private
   */
  #parseFormula(formula, startIndex = 0) {
    let mass = 0;
    let index = startIndex;

    while (index < formula.length) {
      if (formula[index] === '(') {
        // Parse a group
        const groupMass = this.#parseGroup(formula, index);
        mass += groupMass.mass;
        index = groupMass.index;
      } else if (/[A-Z]/.test(formula[index])) {
        // Parse an element
        const elementMass = this.#parseElement(formula, index);
        mass += elementMass.mass;
        index = elementMass.index;
      } else {
        throw new Error(`Invalid formula: Unexpected character at index ${index}`);
      }
    }

    return mass;
  }

  /**
   * Parses a group in a chemical formula.
   * @param {string} formula - The chemical formula to parse.
   * @param {number} startIndex - The index to start parsing from.
   * @returns {{mass: number, index: number}} The mass of the group and the index after parsing.
   * @private
   */
  #parseGroup(formula, startIndex) {
    let mass = 0;
    let index = startIndex + 1; // Skip the opening parenthesis
    let parenthesisCount = 1;

    while (index < formula.length && parenthesisCount > 0) {
      if (formula[index] === '(') {
        parenthesisCount++;
      } else if (formula[index] === ')') {
        parenthesisCount--;
      }
      index++;
    }

    if (parenthesisCount !== 0) {
      throw new Error('Invalid formula: Unmatched parentheses');
    }

    const groupFormula = formula.slice(startIndex + 1, index - 1);
    mass = this.#parseFormula(groupFormula);

    // Parse the multiplier
    const multiplierMatch = formula.slice(index).match(/^\d+/);
    if (multiplierMatch) {
      const multiplier = parseInt(multiplierMatch[0], 10);
      mass *= multiplier;
      index += multiplierMatch[0].length;
    }

    return { mass, index };
  }

  /**
   * Parses an element in a chemical formula.
   * @param {string} formula - The chemical formula to parse.
   * @param {number} startIndex - The index to start parsing from.
   * @returns {{mass: number, index: number}} The mass of the element and the index after parsing.
   * @private
   */
  #parseElement(formula, startIndex) {
    let mass = 0;
    let index = startIndex;
    let elementSymbol = formula[index];

    if (index + 1 < formula.length && /[a-z]/.test(formula[index + 1])) {
      elementSymbol += formula[index + 1];
      index++;
    }

    if (!this.#atomicMasses[elementSymbol]) {
      throw new Error(`Invalid formula: Unknown element ${elementSymbol}`);
    }

    mass = this.#atomicMasses[elementSymbol];

    // Parse the count
    const countMatch = formula.slice(index + 1).match(/^\d+/);
    if (countMatch) {
      const count = parseInt(countMatch[0], 10);
      mass *= count;
      index += countMatch[0].length + 1; // Add 1 to skip the element symbol
    } else {
      index++;
    }

    return { mass, index };
  }
}

module.exports = MolarMassCalculator;