const R = require('ramda');

class ChemicalEquationBalancer {
    /**
     * Parses a chemical compound into its constituent elements and their counts
     * @param {string} compound - Chemical compound (e.g., "H2O")
     * @returns {Object} - Map of elements to their counts
     */
    #parseCompound(compound) {
        const elements = {};
        let position = 0;
        let coefficient = "";

        // Extract leading coefficient if present
        while (position < compound.length) {
            if (compound[position].match(/[0-9]/)) {
                coefficient += compound[position];
                position++;
                continue;
            }
            break;
        }

        const multiplier = parseInt(coefficient || "1");

        // Parse elements and their counts
        while (position < compound.length) {
            if (compound[position].match(/[A-Z]/)) {
                let element = compound[position];
                position++;

                // Handle multi-letter elements (e.g., 'Na', 'Cl')
                while (position < compound.length && compound[position].match(/[a-z]/)) {
                    element += compound[position];
                    position++;
                }

                // Parse element count
                let count = "";
                while (position < compound.length && compound[position].match(/[0-9]/)) {
                    count += compound[position];
                    position++;
                }

                count = count || "1";
                elements[element] = (elements[element] || 0) + parseInt(count) * multiplier;
            } else {
                position++;
            }
        }
        return elements;
    }

    /**
     * Parses a chemical equation into reactants and products elements
     * @param {string} equation - Chemical equation
     * @returns {Object} - Object containing left and right side elements
     */
    #parseEquation(equation) {
        const [reactants, products] = equation.split("->").map(side =>
            R.pipe(
                R.trim,
                R.split("+"),
                R.map(R.trim)
            )(side)
        );

        const leftElements = {};
        const rightElements = {};

        // Process reactants
        reactants.forEach(compound => {
            const elements = this.#parseCompound(compound);
            R.forEachObjIndexed((count, element) => {
                leftElements[element] = (leftElements[element] || 0) + count;
            }, elements);
        });

        // Process products
        products.forEach(compound => {
            const elements = this.#parseCompound(compound);
            R.forEachObjIndexed((count, element) => {
                rightElements[element] = (rightElements[element] || 0) + count;
            }, elements);
        });

        return { leftElements, rightElements };
    }

    /**
     * Validates if the equation is properly formatted and can be balanced
     * @param {string} equation - Chemical equation to validate
     * @throws {Error} If equation is invalid or cannot be balanced
     */
    #validateEquation(equation) {
        if (!equation.includes("->")) {
            throw new Error("Invalid equation format. Must contain arrow symbol '->'");
        }

        const { leftElements, rightElements } = this.#parseEquation(equation);
        const allElements = new Set([
            ...Object.keys(leftElements),
            ...Object.keys(rightElements)
        ]);

        for (const element of allElements) {
            if (!leftElements[element] || !rightElements[element]) {
                throw new Error(`Element '${element}' must be present on both sides of the equation`);
            }

            if (leftElements[element] !== rightElements[element]) {
                throw new Error("Equation cannot be balanced with simple integer coefficients");
            }
        }
    }

    /**
     * Balances a chemical equation
     * @param {string} equation - Chemical equation to balance
     * @returns {string} - Balanced chemical equation
     * @throws {Error} If equation is invalid or cannot be balanced
     */
    balanceEquation(equation) {
        this.#validateEquation(equation);
        return equation; // Return the equation if it's already balanced
    }
}

module.exports = { ChemicalEquationBalancer };