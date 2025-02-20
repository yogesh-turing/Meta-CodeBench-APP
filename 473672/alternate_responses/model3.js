const R = require('ramda');

/**
 * Calculator for determining molar mass of chemical compounds
 */
class MolarMassCalculator {
    // Private atomic mass lookup table
    #atomicMasses = {
        H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16,
        F: 19, Ne: 20, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31,
        S: 32, Cl: 35, Ar: 40, K: 39, Ca: 40, Fe: 56, Cu: 64,
        Zn: 65, Ag: 108, Au: 197
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
     * Parses chemical formula recursively
     * @private
     * @param {string} formula - Chemical formula to parse
     * @param {number} startIndex - Starting index for parsing
     * @returns {number} - Calculated mass for the formula segment
     */
    #parseFormula(formula, startIndex = 0) {
        let mass = 0;
        let index = startIndex;

        while (index < formula.length) {
            if (formula[index] === "(") {
                const { newIndex, submass } = this.#handleParentheses(formula, index);
                mass += submass;
                index = newIndex;
            } else if (/[A-Z]/.test(formula[index])) {
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
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index of parentheses group
     * @returns {Object} - New index and calculated submass
     */
    #handleParentheses(formula, startIndex) {
        let parenthesesCount = 1;
        let currentIndex = startIndex + 1;

        if (currentIndex >= formula.length || 
            formula[currentIndex] === ")" || 
            !/[A-Z(]/.test(formula[currentIndex])) {
            throw new Error("Invalid formula: Empty or invalid group");
        }

        const closingIndex = this.#findClosingParenthesis(formula, currentIndex);
        const subformula = formula.slice(startIndex + 1, closingIndex);
        const submass = this.#parseFormula(subformula);
        
        const { number: multiplier, newIndex } = this.#extractNumber(formula, closingIndex + 1);
        
        return {
            newIndex,
            submass: submass * multiplier
        };
    }

    /**
     * Finds the closing parenthesis for a group
     * @private
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index to search from
     * @returns {number} - Index of closing parenthesis
     */
    #findClosingParenthesis(formula, startIndex) {
        let parenthesesCount = 1;
        let currentIndex = startIndex;

        while (currentIndex < formula.length && parenthesesCount > 0) {
            if (formula[currentIndex] === "(") parenthesesCount++;
            if (formula[currentIndex] === ")") parenthesesCount--;
            currentIndex++;
        }

        if (parenthesesCount !== 0) {
            throw new Error("Invalid formula: Unmatched parentheses");
        }

        return currentIndex - 1;
    }

    /**
     * Handles individual elements in the formula
     * @private
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index of element
     * @returns {Object} - New index and calculated element mass
     */
    #handleElement(formula, startIndex) {
        const element = this.#extractElement(formula, startIndex);
        if (!this.#atomicMasses[element.symbol]) {
            throw new Error(`Invalid formula: Unknown element ${element.symbol}`);
        }

        const { number: count, newIndex } = this.#extractNumber(formula, element.newIndex);
        
        return {
            newIndex,
            elementMass: this.#atomicMasses[element.symbol] * count
        };
    }

    /**
     * Extracts element symbol from formula
     * @private
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index of element
     * @returns {Object} - Element symbol and new index
     */
    #extractElement(formula, startIndex) {
        let symbol = formula[startIndex];
        let newIndex = startIndex + 1;

        if (newIndex < formula.length && /[a-z]/.test(formula[newIndex])) {
            symbol += formula[newIndex];
            newIndex++;
        }

        return { symbol, newIndex };
    }

    /**
     * Extracts number from formula
     * @private
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index to extract number from
     * @returns {Object} - Extracted number and new index
     */
    #extractNumber(formula, startIndex) {
        let numberStr = "";
        let currentIndex = startIndex;

        while (currentIndex < formula.length && /[0-9]/.test(formula[currentIndex])) {
            numberStr += formula[currentIndex];
            currentIndex++;
        }

        return {
            number: numberStr ? parseInt(numberStr) : 1,
            newIndex: currentIndex
        };
    }
}

module.exports = { MolarMassCalculator };