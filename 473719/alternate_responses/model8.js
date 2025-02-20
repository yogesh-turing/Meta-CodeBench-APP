function calculateMolarMass(formula) {
    // Atomic masses of common elements (in g/mol)
    const elementNames = [
        'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 
        'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 
        'Fe', 'Cu', 'Zn', 'Ag', 'Au'
    ];

    const atomicMasses = {
        'H': 1, 'He': 4, 'Li': 7, 'Be': 9, 'B': 11, 'C': 12, 'N': 14, 'O': 16, 'F': 19, 'Ne': 20, 
        'Na': 23, 'Mg': 24, 'Al': 27, 'Si': 28, 'P': 31, 'S': 32, 'Cl': 35, 'Ar': 40, 'K': 39, 'Ca': 40, 
        'Fe': 56, 'Cu': 63, 'Zn': 65, 'Ag': 108, 'Au': 197
    };

    // Helper function to parse the formula and calculate the molar mass
    function parseFormula(formula) {
        let mass = 0;
        let multiplier = 1;
        let element = '';
        let num = '';

        for (let i = 0; i < formula.length; i++) {
            const char = formula[i];
            if (char === '(') {
                // Start of a group
                let group = '';
                let depth = 1;
                for (let j = i + 1; j < formula.length; j++) {
                    const groupChar = formula[j];
                    if (groupChar === '(') {
                        depth++;
                    } else if (groupChar === ')') {
                        depth--;
                        if (depth === 0) {
                            i = j;
                            break;
                        }
                    }
                    group += groupChar;
                }
                mass += parseFormula(group) * multiplier;
                multiplier = 1;
            } else if (char === ')') {
                // End of a group
                return mass * multiplier;
            } else if (char.match(/[a-zA-Z]/)) {
                // Element
                element += char;
            } else if (char.match(/[0-9]/)) {
                // Number
                num += char;
            } else if (char === '') {
                // Space, ignore
                continue;
            } else {
                throw new Error(`Invalid character in formula: ${char}`);
            }

            if (element && !num) {
                // Element without a number, assume 1
                mass += atomicMasses[element];
                element = '';
            } else if (element && num) {
                // Element with a number
                mass += atomicMasses[element] * parseInt(num);
                element = '';
                num = '';
            } else if (!element && num) {
                // Number without an element, assume it's a multiplier
                multiplier = parseInt(num);
                num = '';
            }
        }

        if (element) {
            throw new Error(`Invalid formula: ${formula}`);
        }

        return mass;
    }

    return parseFormula(formula);
}

module.exports = { calculateMolarMass };