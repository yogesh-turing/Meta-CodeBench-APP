function parseCompound(compound) {
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(compound)) {
        throw new Error(`Invalid compound format: ${compound}`);
    }

    const elements = {};
    let i = 0;
    
    while (i < compound.length) {
        // Get element symbol (1 or 2 characters)
        let symbol = compound[i];
        if (i + 1 < compound.length && /[a-z]/.test(compound[i + 1])) {
            symbol += compound[i + 1];
            i++;
        }
        i++;

        // Get number if exists
        let num = '';
        while (i < compound.length && /[0-9]/.test(compound[i])) {
            num += compound[i];
            i++;
        }

        elements[symbol] = elements[symbol] || 0;
        elements[symbol] += num ? parseInt(num) : 1;
    }

    return elements;
}

function parseEquation(equation) {
    if (!equation.includes("->")) {
        throw new Error("Invalid equation format. Must contain ->");
    }

    const [reactants, products] = equation.split("->").map(side => 
        side.trim().split("+").map(compound => compound.trim())
    );

    const leftElements = {};
    const rightElements = {};

    for (const compound of reactants) {
        const elements = parseCompound(compound);
        for (const [element, count] of Object.entries(elements)) {
            leftElements[element] = (leftElements[element] || 0) + count;
        }
    }

    for (const compound of products) {
        const elements = parseCompound(compound);
        for (const [element, count] of Object.entries(elements)) {
            rightElements[element] = (rightElements[element] || 0) + count;
        }
    }

    return { leftElements, rightElements };
}

function balanceEquation(equation) {
    if (!equation.includes("->")) {
        throw new Error("Invalid equation format. Must contain ->");
    }

    const [reactants, products] = equation.split("->").map(side => 
        side.trim().split("+").map(compound => compound.trim())
    );

    // Create matrix of coefficients
    const allElements = new Set();
    const compounds = [...reactants, ...products];
    const elementMatrix = [];

    // Parse all compounds and collect unique elements
    const parsedCompounds = compounds.map(compound => {
        const elements = parseCompound(compound);
        Object.keys(elements).forEach(element => allElements.add(element));
        return elements;
    });

    // Create system of linear equations
    Array.from(allElements).forEach(element => {
        const row = new Array(compounds.length).fill(0);
        parsedCompounds.forEach((compound, index) => {
            const coefficient = compound[element] || 0;
            row[index] = index < reactants.length ? coefficient : -coefficient;
        });
        elementMatrix.push(row);
    });

    // Find the smallest positive integer solution
    let coefficients = new Array(compounds.length).fill(1);
    let balanced = false;
    let maxIterations = 1000;

    while (!balanced && maxIterations > 0) {
        balanced = true;
        elementMatrix.forEach(row => {
            let sum = 0;
            row.forEach((coef, i) => sum += coef * coefficients[i]);
            if (sum !== 0) balanced = false;
        });

        if (!balanced) {
            coefficients = coefficients.map(c => c + 1);
        }
        maxIterations--;
    }

    if (!balanced) {
        throw new Error("Could not balance equation");
    }

    // Construct balanced equation
    const balancedReactants = reactants.map((compound, i) => 
        coefficients[i] === 1 ? compound : `${coefficients[i]}${compound}`
    ).join(" + ");

    const balancedProducts = products.map((compound, i) => 
        coefficients[i + reactants.length] === 1 ? compound : 
        `${coefficients[i + reactants.length]}${compound}`
    ).join(" + ");

    return `${balancedReactants} -> ${balancedProducts}`;
}

module.exports = { balanceEquation, parseCompound, parseEquation };