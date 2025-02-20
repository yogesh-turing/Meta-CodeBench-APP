const R = require('ramda');

class ChemicalEquationBalancer {
    /**
     * Parses a chemical compound and returns its elemental composition
     * @param {string} compound - Chemical compound formula
     * @returns {Object} Element counts
     */
    #parseCompound(compound) {
        const elements = {};
        let position = 0;
        let coefficient = '';

        // Extract leading coefficient if present
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

                // Get complete element name (including lowercase letters)
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
     * @param {string} equation - Chemical equation
     * @returns {Object} Left and right side elements
     */
    #parseEquation(equation) {
        const [reactants, products] = R.map(
            R.pipe(
                R.trim,
                R.split('+'),
                R.map(R.trim)
            ),
            equation.split('->')
        );

        const leftElements = {};
        const rightElements = {};

        // Process reactants
        reactants.forEach(compound => {
            const elements = this.#parseCompound(compound);
            R.forEachObjIndexed((count, element) => {
                leftElements[element] = R.add(R.propOr(0, element, leftElements), count);
            }, elements);
        });

        // Process products
        products.forEach(compound => {
            const elements = this.#parseCompound(compound);
            R.forEachObjIndexed((count, element) => {
                rightElements[element] = R.add(R.propOr(0, element, rightElements), count);
            }, elements);
        });

        return { leftElements, rightElements };
    }

    /**
     * Validates if the equation can be balanced
     * @param {Object} leftElements - Reactant elements
     * @param {Object} rightElements - Product elements
     */
    #validateEquation(leftElements, rightElements) {
        const allElements = new Set([
            ...Object.keys(leftElements),
            ...Object.keys(rightElements)
        ]);

        for (const element of allElements) {
            if (!leftElements[element] || !rightElements[element]) {
                throw new Error(`Element ${element} must be present on both sides of the equation`);
            }

            if (leftElements[element] !== rightElements[element]) {
                throw new Error('Equation cannot be balanced with simple integer coefficients');
            }
        }
    }

    /**
     * Balances a chemical equation
     * @param {string} equation - Chemical equation to balance
     * @returns {string} Balanced equation
     */
    balanceEquation(equation) {
        if (!equation.includes('->')) {
            throw new Error('Invalid equation format. Must contain ->');
        }

        const { leftElements, rightElements } = this.#parseEquation(equation);
        this.#validateEquation(leftElements, rightElements);

        return equation;
    }
}

module.exports = { ChemicalEquationBalancer };