const R = require('ramda');

/**
 * Calculator for determining molar mass of chemical compounds
 */
class MolarMassCalculator {
    #atomicMasses = {
        H: 1, He: 4, Li: 7, Be: 9, B: 11,
        C: 12, N: 14, O: 16, F: 19, Ne: 20,
        Na: 23, Mg: 24, Al: 27, Si: 28, P: 31,
        S: 32, Cl: 35, Ar: 40, K: 39, Ca: 40,
        Fe: 56, Cu: 64, Zn: 65, Ag: 108, Au: 197
    };

    /**
     * Calculates the molar mass of a chemical formula
     * @param {string} formula - Chemical formula to calculate
     * @returns {number} - Calculated molar mass
     * @throws {Error} - If formula is invalid
     */
    calculate(formula) {
        if (!formula || typeof formula !== "string") {
            throw new Error("Invalid formula: Formula must be a non-empty string");
        }
        return this.#parseFormula(formula);
    }

    /**
     * Parses chemical formula and calculates molar mass
     * @private
     */
    #parseFormula(formula, startIndex = 0) {
        let mass = 0;
        let index = startIndex;

        while (index < formula.length) {
            if (formula[index] === "(") {
                const { newIndex, submass } = this.#handleParentheses(formula, index);
                mass += submass;
                index = newIndex;
            } else if (this.#isUpperCase(formula[index])) {
                const { newIndex, elementMass } = this.#handleElement(formula, index);
                mass += elementMass;
                index = newIndex;
            } else {
                throw new Error("Invalid formula: Unexpected character");
            }
        }
        return mass;
    }

    /**
     * Handles parentheses groups in the formula
     * @private
     */
    #handleParentheses(formula, startIndex) {
        let parenthesesCount = 1;
        let currentIndex = startIndex + 1;

        if (currentIndex >= formula.length || 
            formula[currentIndex] === ")" || 
            !this.#isValidStartChar(formula[currentIndex])) {
            throw new Error("Invalid formula: Empty or invalid group");
        }

        const endIndex = this.#findClosingParenthesis(formula, currentIndex);
        const subFormula = formula.slice(startIndex + 1, endIndex - 1);
        const submass = this.#parseFormula(subFormula);
        
        const { number, lastIndex } = this.#extractNumber(formula, endIndex);
        return {
            newIndex: lastIndex,
            submass: submass * number
        };
    }

    /**
     * Handles individual elements in the formula
     * @private
     */
    #handleElement(formula, startIndex) {
        let element = formula[startIndex];
        let currentIndex = startIndex + 1;

        if (currentIndex < formula.length && this.#isLowerCase(formula[currentIndex])) {
            element += formula[currentIndex];
            currentIndex++;
        }

        if (!this.#atomicMasses[element]) {
            throw new Error(`Invalid formula: Unknown element ${element}`);
        }

        const { number, lastIndex } = this.#extractNumber(formula, currentIndex);
        return {
            newIndex: lastIndex,
            elementMass: this.#atomicMasses[element] * number
        };
    }

    /**
     * Extracts number following an element or group
     * @private
     */
    #extractNumber(formula, startIndex) {
        let numberStr = "";
        let index = startIndex;

        while (index < formula.length && this.#isDigit(formula[index])) {
            numberStr += formula[index];
            index++;
        }

        return {
            number: numberStr ? parseInt(numberStr) : 1,
            lastIndex: index
        };
    }

    /**
     * Finds the closing parenthesis for a group
     * @private
     */
    #findClosingParenthesis(formula, startIndex) {
        let parenthesesCount = 1;
        let index = startIndex;

        while (index < formula.length && parenthesesCount > 0) {
            if (formula[index] === "(") parenthesesCount++;
            if (formula[index] === ")") parenthesesCount--;
            index++;
        }

        if (parenthesesCount !== 0) {
            throw new Error("Invalid formula: Unmatched parentheses");
        }

        return index;
    }

    // Helper methods for character validation
    #isUpperCase = char => /[A-Z]/.test(char);
    #isLowerCase = char => /[a-z]/.test(char);
    #isDigit = char => /[0-9]/.test(char);
    #isValidStartChar = char => /[A-Z(]/.test(char);
}

module.exports = { MolarMassCalculator };