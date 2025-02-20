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

    // Regular expression to match element symbols and their counts
    const regex = /([A-Z][a-z]*)(\d*)/g;

    let molarMass = 0;

    // Remove any whitespace and convert to uppercase
    formula = formula.replace(/\s+/g, '').toUpperCase();

    // Check for parentheses and process the contents
    if (formula.includes('(')) {
        // Find the contents of the parentheses
        const start = formula.indexOf('(');
        const end = formula.indexOf(')');
        const contents = formula.substring(start + 1, end);

        // Find the count after the parentheses
        const count = parseInt(formula.substring(end + 1));

        // Calculate the molar mass of the contents
        const contentsMolarMass = calculateMolarMass(contents);

        // Add the molar mass of the contents times the count to the total
        molarMass += contentsMolarMass * count;

        // Remove the processed part from the formula
        formula = formula.substring(0, start) + formula.substring(end + 1 + count.toString().length);
    }

    // Process the remaining elements
    let match;
    while ((match = regex.exec(formula)) !== null) {
        const element = match[1];
        const count = match[2] ? parseInt(match[2]) : 1;

        // Check if the element is valid
        if (!elementNames.includes(element)) {
            throw new Error(`Invalid element: ${element}`);
        }

        // Add the molar mass of the element times the count to the total
        molarMass += atomicMasses[element] * count;
    }

    return molarMass;
}

module.exports = { calculateMolarMass };