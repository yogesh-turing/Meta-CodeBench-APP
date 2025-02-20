const R = require('rambda');

class MolarMassCalculator {
  constructor() {
    // Dictionary of atomic masses for common elements
    // Each key is the element symbol and value is its atomic mass
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

  // Validates that the input formula is a non-empty string
  #validateFormula(formula) {
    if (!formula || typeof formula !== "string") {
      throw new Error("Invalid formula: Formula must be a non-empty string");
    }
  }

  // Checks if a group starts with a valid character (uppercase letter or opening parenthesis)
  #isValidGroupStart(formula, index) {
    return !(
      index >= formula.length ||
      formula[index] === ")" ||
      !/[A-Z(]/.test(formula[index])
    );
  }

  // Parses a number from the formula at the given index
  // Returns the parsed number (defaults to 1 if no number) and the index after the number
  #parseNumber(formula, startIndex) {
    const remainingChars = formula.slice(startIndex);
    // Use Ramda's functional pipeline to:
    // 1. Split string into array of characters
    // 2. Take characters while they are digits
    // 3. Join them back into a string
    const digitStr = R.pipe(
      R.split(''),
      R.takeWhile(char => /[0-9]/.test(char)),
      R.join('')
    )(remainingChars);

    return {
      number: digitStr.length ? parseInt(digitStr) : 1,
      endIndex: startIndex + digitStr.length
    };
  }

  // Parses a chemical element (e.g., 'Na', 'H', 'Fe') and its count
  // Returns the total mass of the element and the index after parsing
  #parseElement(formula, startIndex) {
    let element = formula[startIndex];
    let currentIndex = startIndex + 1;
    
    // Check for lowercase letter to handle two-letter elements (e.g., 'Na', 'Fe')
    if (currentIndex < formula.length && /[a-z]/.test(formula[currentIndex])) {
      element += formula[currentIndex];
      currentIndex++;
    }

    // Verify the element exists in our atomic masses dictionary
    if (!this.atomicMasses[element]) {
      throw new Error(`Invalid formula: Unknown element ${element}`);
    }

    // Parse any number following the element (e.g., H2, O3)
    const { number: count, endIndex } = this.#parseNumber(formula, currentIndex);
    return {
      mass: this.atomicMasses[element] * count,
      endIndex
    };
  }

  // Parses a group enclosed in parentheses (e.g., '(OH)2')
  // Returns the total mass of the group and the index after parsing
  #parseGroup(formula, startIndex) {
    let parenthesesCount = 1;
    let currentIndex = startIndex + 1;

    // Ensure group starts with a valid character
    if (!this.#isValidGroupStart(formula, currentIndex)) {
      throw new Error("Invalid formula: Empty or invalid group");
    }

    // Find the matching closing parenthesis
    while (currentIndex < formula.length && parenthesesCount > 0) {
      if (formula[currentIndex] === "(") parenthesesCount++;
      if (formula[currentIndex] === ")") parenthesesCount--;
      currentIndex++;
    }

    // Check for unmatched parentheses
    if (parenthesesCount !== 0) {
      throw new Error("Invalid formula: Unmatched parentheses");
    }

    // Recursively parse the contents inside parentheses
    const subMass = this.#parseFormulaRecursive(
      formula.slice(startIndex + 1, currentIndex - 1)
    );
    // Parse the multiplier after the closing parenthesis
    const { number: multiplier, endIndex } = this.#parseNumber(formula, currentIndex);

    return {
      mass: subMass * multiplier,
      endIndex
    };
  }

  // Recursively parses a chemical formula
  // Returns the total mass of the formula
  #parseFormulaRecursive(formula, startIndex = 0) {
    let totalMass = 0;
    let currentIndex = startIndex;

    while (currentIndex < formula.length) {
      let result;

      // Handle either a group in parentheses or a single element
      if (formula[currentIndex] === "(") {
        result = this.#parseGroup(formula, currentIndex);
      } else if (/[A-Z]/.test(formula[currentIndex])) {
        result = this.#parseElement(formula, currentIndex);
      } else {
        throw new Error("Invalid formula: Unexpected character");
      }

      totalMass += result.mass;
      currentIndex = result.endIndex;
    }

    return totalMass;
  }

  // Public method to calculate the molar mass of a chemical formula
  calculate(formula) {
    this.#validateFormula(formula);
    return this.#parseFormulaRecursive(formula);
  }
}

module.exports = { MolarMassCalculator };