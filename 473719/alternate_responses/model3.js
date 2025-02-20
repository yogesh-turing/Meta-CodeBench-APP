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

    let i = 0;
    
    function parseGroup() {
        let mass = 0;
        let element = '';
        
        while (i < formula.length) {
            const char = formula[i];
            
            if (char === '(') {
                i++;
                mass += parseGroup();
            } else if (char === ')') {
                i++;
                let multiplier = '';
                while (i < formula.length && /[0-9]/.test(formula[i])) {
                    multiplier += formula[i];
                    i++;
                }
                return mass * (multiplier ? parseInt(multiplier) : 1);
            } else if (char >= 'A' && char <= 'Z') {
                if (element) {
                    if (!atomicMasses[element]) {
                        throw new Error(`Invalid element: ${element}`);
                    }
                    mass += atomicMasses[element];
                }
                element = char;
            } else if (char >= 'a' && char <= 'z') {
                element += char;
            } else if (char >= '0' && char <= '9') {
                if (!element) {
                    throw new Error('Invalid formula: Unexpected number');
                }
                let number = '';
                while (i < formula.length && /[0-9]/.test(formula[i])) {
                    number += formula[i];
                    i++;
                }
                if (!atomicMasses[element]) {
                    throw new Error(`Invalid element: ${element}`);
                }
                mass += atomicMasses[element] * parseInt(number);
                element = '';
                continue;
            } else {
                throw new Error('Invalid formula: Contains invalid characters');
            }
            i++;
        }
        
        if (element) {
            if (!atomicMasses[element]) {
                throw new Error(`Invalid element: ${element}`);
            }
            mass += atomicMasses[element];
        }
        
        return mass;
    }

    return parseGroup();
}

module.exports = { calculateMolarMass };