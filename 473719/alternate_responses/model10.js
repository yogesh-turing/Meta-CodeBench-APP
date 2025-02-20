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

    // Helper function to parse a group (e.g. '(He)2')
    function parseGroup(group) {
        const match = group.match(/^\((.*)\)(\d+)$/);
        if (match) {
            const innerGroup = match[1];
            const multiplier = parseInt(match[2]);
            return multiplier * calculateMolarMass(innerGroup);
        } else {
            throw new Error(`Invalid group: ${group}`);
        }
    }

    // Parse the formula
    let molarMass = 0;
    let i = 0;
    while (i < formula.length) {
        // Check if the current character is an opening parenthesis
        if (formula[i] === '(') {
            // Find the matching closing parenthesis
            const j = formula.indexOf(')', i);
            if (j === -1) {
                throw new Error(`Unbalanced parentheses in formula: ${formula}`);
            }
            // Extract the group and parse it
            const group = formula.substring(i, j + 1);
            molarMass += parseGroup(group);
            i = j + 1;
        } else {
            // Check if the current character is an element symbol
            const element = formula.substring(i, i + 2);
            if (elementNames.includes(element)) {
                // Check if the element has a multiplier (e.g. 'Fe2')
                const multiplierMatch = formula.substring(i + 2).match(/^(\d+)/);
                let multiplier = 1;
                if (multiplierMatch) {
                    multiplier = parseInt(multiplierMatch[1]);
                    i += multiplierMatch[1].length;
                }
                molarMass += atomicMasses[element] * multiplier;
                i += 2;
            } else {
                // Check if the current character is a single-character element symbol
                const element = formula.substring(i, i + 1);
                if (elementNames.includes(element)) {
                    // Check if the element has a multiplier (e.g. 'H2')
                    const multiplierMatch = formula.substring(i + 1).match(/^(\d+)/);
                    let multiplier = 1;
                    if (multiplierMatch) {
                        multiplier = parseInt(multiplierMatch[1]);
                        i += multiplierMatch[1].length;
                    }
                    molarMass += atomicMasses[element] * multiplier;
                    i += 1;
                } else {
                    throw new Error(`Invalid element symbol: ${element}`);
                }
            }
        }
    }

    return molarMass;
}

module.exports = { calculateMolarMass };