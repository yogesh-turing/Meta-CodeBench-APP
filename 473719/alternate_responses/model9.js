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

    // Your code here
    // Calculate the molar mass of the chemical formula
    // Return the result

    // Remove any parentheses and calculate the molar mass
    formula = formula.replace(/\(/g, '').replace(/\)/g, '');
    let molarMass = 0;

    // Split the formula into individual elements
    const elements = formula.match(/[A-Z][a-z]?[0-9]*/g);

    // Calculate the molar mass for each element
    elements.forEach(element => {
        const elementName = element.replace(/[0-9]/g, '');
        const quantity = element.replace(/[^0-9]/g, '') || 1;
        if (!atomicMasses[elementName]) {
            throw new Error(`Invalid element: ${elementName}`);
        }
        molarMass += atomicMasses[elementName] * parseInt(quantity);
    });

    return molarMass;
}

module.exports = {calculateMolarMass};