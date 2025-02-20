const R = require('ramda');

class ChemicalEquationBalancer {
    /**
     * Parses a chemical compound into its constituent elements and their counts
     * @private
     * @param {string} compound - Chemical compound to parse
     * @returns {Object} Object containing elements and their counts
     */
    #parseCompound(compound) {
        const elements = {};
        let position = 0;
        let coefficient = '';

        // Extract leading coefficient
        while (position < compound.length) {
            if (compound[position].match(/[0-9]/)) {
                coefficient += compound[position];
                position++;
                continue;
            }
            break;
        }

        const multiplier = parseInt(coefficient || '1');

        // Parse elements and their counts
        while (position < compound.length) {
            if (compound[position].match(/[A-Z]/)) {
                let element = compound[position];
                position++;

                // Get complete element name
                while (position < compound.length && compound[position].match(/[a-z]/)) {
                    element += compound[position];
                    position++;
                }

                // Get element count
                let count = '';
                while (position < compound.length && compound[position].match(/[0-9]/)) {
                    count += compound[position];
                    position++;
                }

                const elementCount = parseInt(count || '1');
                elements[element] = R.add(
                    R.propOr(0, element, elements),
                    R.multiply(elementCount, multiplier)
                );
            } else {
                position++;
            }
        }
        return elements;
    }

    /**
     * Parses a chemical equation into reactants and products elements
     * @private
     * @param {string} equation - Chemical equation to parse
     * @returns {Object} Object containing left and right side elements
     */
    #parseEquation(equation) {
        const [reactants, products] = R.pipe(
            R.split('->'),
            R.map(R.pipe(
                R.trim,
                R.split('+'),
                R.map(R.trim)
            ))
        )(equation);

        const leftElements = {};
        const rightElements = {};

        // Process reactants
        R.forEach(compound => {
            const elements = this.#parseCompound(compound);
            R.forEachObjIndexed((count, element) => {
                leftElements[element] = R.add(R.propOr(0, element, leftElements), count);
            }, elements);
        }, reactants);

        // Process products
        R.forEach(compound => {
            const elements = this.#parseCompound(compound);
            R.forEachObjIndexed((count, element) => {
                rightElements[element] = R.add(R.propOr(0, element, rightElements), count);
            }, elements);
        }, products);

        return { leftElements, rightElements };
    }

    /**
     * Validates if the equation is properly formatted
     * @private
     * @param {string} equation - Chemical equation to validate
     * @throws {Error} If equation format is invalid
     */
    #validateEquationFormat(equation) {
        if (!equation || typeof equation !== 'string') {
            throw new Error('Equation must be a non-empty string');
        }
        if (!equation.includes('->')) {
            throw new Error('Invalid equation format. Must contain ->');
        }
    }

    /**
     * Balances a chemical equation
     * @public
     * @param {string} equation - Chemical equation to balance
     * @returns {string} Balanced chemical equation
     * @throws {Error} If equation cannot be balanced
     */
    balanceEquation(equation) {
        this.#validateEquationFormat(equation);

        const { leftElements, rightElements } = this.#parseEquation(equation);

        // Get all unique elements
        const allElements = R.uniq([
            ...Object.keys(leftElements),
            ...Object.keys(rightElements)
        ]);

        // Validate element presence and balance
        R.forEach(element => {
            if (!leftElements[element] || !rightElements[element]) {
                throw new Error(`Element ${element} is not present on both sides of the equation`);
            }

            if (leftElements[element] !== rightElements[element]) {
                throw new Error('Equation cannot be balanced with simple integer coefficients');
            }
        }, allElements);

        return equation;
    }
}

module.exports = { ChemicalEquationBalancer };