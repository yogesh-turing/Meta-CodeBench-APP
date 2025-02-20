function calculateMolarMass(formula) {
    // Atomic masses of common elements (in g/mol)
    const elementNames = [
        'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 
        'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 
        'Fe', 'Cu', 'Zn', 'Ag', 'Au'
    ];

    // update this with the atomic masses
    const atomicMasses = {
        'H': 1, 'He': 4, 'Li': 7, 'Be': 9, 'B': 11, 'C': 12, 'N': 14, 'O': 16, 'F': 19, 'Ne': 20, 
        'Na': 23, 'Mg': 24, 'Al': 27, 'Si': 28, 'P': 31, 'S': 32, 'Cl': 35, 'Ar': 40, 'K': 39, 'Ca': 40, 
        'Fe': 56, 'Cu': 63, 'Zn': 65, 'Ag': 108, 'Au': 197
    };

    // Check if the formula is valid
    if (!formula) {
        throw new Error('Formula is empty');
    }

    // Check if the formula contains any invalid elements
    for (let i = 0; i < formula.length; i++) {
        if (!elementNames.includes(formula[i]) && !isNaN(formula[i])) {
            throw new Error('Formula contains invalid elements');
        }
    }

    // Calculate the molar mass of the chemical formula
    let molarMass = 0;
    let element = '';
    let multiplier = 1;
    let isMultiplier = false;

    for (let i = 0; i < formula.length; i++) {
        if (formula[i] === '(') {
            let j = i + 1;
            while (formula[j] !== ')') {
                j++;
            }
            let subFormula = formula.substring(i + 1, j);
            let subMolarMass = calculateMolarMass(subFormula);
            let multiplier = parseInt(formula[j + 1]);
            if (isNaN(multiplier)) {
                multiplier = 1;
            }
            molarMass += subMolarMass * multiplier;
            i = j + 1;
        } else if (isNaN(formula[i])) {
            if (isMultiplier) {
                molarMass += atomicMasses[element] * multiplier;
                element = '';
                multiplier = 1;
                isMultiplier = false;
            }
            element += formula[i];
        } else {
            isMultiplier = true;
            multiplier = parseInt(formula[i]);
        }
    }

    if (element !== '') {
        molarMass += atomicMasses[element] * multiplier;
    }

    return molarMass;
}

module.exports = {calculateMolarMass};