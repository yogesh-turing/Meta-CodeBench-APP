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
     * @param {string} formula - Chemical formula to analyze
     * @returns {number} - Calculated molar mass
     * @throws {Error} - If formula is invalid
     */
    calculate(formula) {
        if (!formula || typeof formula !== "string") {
            throw new Error("Invalid formula: Must be a non-empty string");
        }
        return this.#parseFormula(formula);
    }

    /**
     * Parses chemical formula and calculates total molar mass
     * @private
     * @param {string} formula - Chemical formula to parse
     * @param {number} startIndex - Starting index for parsing
     * @returns {number} - Calculated molar mass
     */
    #parseFormula(formula, startIndex = 0) {
        let totalMass = 0;
        let index = startIndex;

        while (index < formula.length) {
            if (formula[index] === "(") {
                const { mass, newIndex } = this.#handleParentheses(formula, index);
                totalMass += mass;
                index = newIndex;
            } else if (/[A-Z]/.test(formula[index])) {
                const { mass, newIndex } = this.#handleElement(formula, index);
                totalMass += mass;
                index = newIndex;
            } else {
                throw new Error("Invalid formula: Unexpected character");
            }
        }
        return totalMass;
    }

    /**
     * Handles parsing of parenthetical groups in formula
     * @private
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index of parenthetical group
     * @returns {Object} - Calculated mass and new index position
     */
    #handleParentheses(formula, startIndex) {
        let parenthesesCount = 1;
        let currentIndex = startIndex + 1;

        if (currentIndex >= formula.length || 
            formula[currentIndex] === ")" || 
            !/[A-Z(]/.test(formula[currentIndex])) {
            throw new Error("Invalid formula: Empty or invalid group");
        }

        const endIndex = this.#findClosingParenthesis(formula, currentIndex);
        const subFormula = formula.slice(startIndex + 1, endIndex);
        const subMass = this.#parseFormula(subFormula);

        const { number: multiplier, newIndex } = this.#extractNumber(formula, endIndex + 1);
        
        return {
            mass: subMass * multiplier,
            newIndex: newIndex
        };
    }

    /**
     * Finds the closing parenthesis matching an opening one
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
     * Handles parsing of individual elements in formula
     * @private
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index of element
     * @returns {Object} - Calculated mass and new index position
     */
    #handleElement(formula, startIndex) {
        const element = this.#extractElement(formula, startIndex);
        const newIndex = startIndex + element.length;

        if (!this.#atomicMasses[element]) {
            throw new Error(`Invalid formula: Unknown element ${element}`);
        }

        const { number: count, newIndex: finalIndex } = this.#extractNumber(formula, newIndex);
        
        return {
            mass: this.#atomicMasses[element] * count,
            newIndex: finalIndex
        };
    }

    /**
     * Extracts element symbol from formula
     * @private
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index of element
     * @returns {string} - Element symbol
     */
    #extractElement(formula, startIndex) {
        const hasLowerCase = startIndex + 1 < formula.length && 
                           /[a-z]/.test(formula[startIndex + 1]);
        return hasLowerCase ? formula.slice(startIndex, startIndex + 2) 
                           : formula[startIndex];
    }

    /**
     * Extracts number following an element or group
     * @private
     * @param {string} formula - Chemical formula
     * @param {number} startIndex - Starting index to extract number from
     * @returns {Object} - Extracted number and new index position
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