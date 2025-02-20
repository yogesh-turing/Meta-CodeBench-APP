function calculateMolarMass(formula) {
    // Atomic masses of common elements (in g/mol)
    const elementNames = [
        'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
        'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
        'Fe', 'Cu', 'Zn', 'Ag', 'Au'
    ];

    const atomicMasses = {
        'H': 1, 'He': 4, 'Li': 7, 'Be': 9, 'B': 11, 'C': 12,
        'N': 14, 'O': 16, 'F': 19, 'Ne': 20, 'Na': 23, 'Mg': 24,
        'Al': 27, 'Si': 28, 'P': 31, 'S': 32, 'Cl': 35, 'Ar': 40,
        'K': 39, 'Ca': 40, 'Fe': 56, 'Cu': 64, 'Zn': 65, 'Ag': 108,
        'Au': 197
    };

    if (!formula || typeof formula !== 'string') {
        throw new Error('Invalid formula: Formula must be a non-empty string');
    }

    function parseFormula(formula, startIndex = 0) {
        let mass = 0;
        let i = startIndex;

        while (i < formula.length) {
            if (formula[i] === '(') {
                let parenthesesCount = 1;
                let j = i + 1;
                while (j < formula.length && parenthesesCount > 0) {
                    if (formula[j] === '(') parenthesesCount++;
                    if (formula[j] === ')') parenthesesCount--;
                    j++;
                }
                if (parenthesesCount !== 0) {
                    throw new Error('Invalid formula: Unmatched parentheses');
                }
                const subMass = parseFormula(formula.slice(i + 1, j - 1));
                let numStr = '';
                while (j < formula.length && /[0-9]/.test(formula[j])) {
                    numStr += formula[j];
                    j++;
                }
                const multiplier = numStr ? parseInt(numStr) : 1;
                mass += subMass * multiplier;
                i = j;
            } else if (/[A-Z]/.test(formula[i])) {
                let element = formula[i];
                if (i + 1 < formula.length && /[a-z]/.test(formula[i + 1])) {
                    element += formula[i + 1];
                    i++;
                }
                if (!atomicMasses[element]) {
                    throw new Error(`Invalid formula: Unknown element ${element}`);
                }
                let numStr = '';
                i++;
                while (i < formula.length && /[0-9]/.test(formula[i])) {
                    numStr += formula[i];
                    i++;
                }
                const count = numStr ? parseInt(numStr) : 1;
                mass += atomicMasses[element] * count;
            } else {
                throw new Error('Invalid formula: Unexpected character');
            }
        }
        return mass;
    }

    return parseFormula(formula);
}

module.exports = { calculateMolarMass };