function parseCompound(compound) {
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(compound)) {
        throw new Error(`Invalid compound format: ${compound}`);
    }

    const elements = {};
    let i = 0;
    
    while (i < compound.length) {
        // Get element symbol
        let symbol = compound[i++];
        while (i < compound.length && /[a-z]/.test(compound[i])) {
            symbol += compound[i++];
        }
        
        // Get number
        let num = '';
        while (i < compound.length && /[0-9]/.test(compound[i])) {
            num += compound[i++];
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

    // Get all unique elements
    compounds.forEach(compound => {
        const elements = parseCompound(compound);
        Object.keys(elements).forEach(element => allElements.add(element));
    });

    // Build matrix rows for each element
    allElements.forEach(element => {
        const row = [];
        reactants.forEach(compound => {
            const elements = parseCompound(compound);
            row.push(elements[element] || 0);
        });
        products.forEach(compound => {
            const elements = parseCompound(compound);
            row.push(-(elements[element] || 0));
        });
        elementMatrix.push(row);
    });

    // Solve using Gaussian elimination
    const n = compounds.length;
    const augmentedMatrix = elementMatrix.map(row => [...row, 0]);
    
    // Add normalization equation
    augmentedMatrix.push(new Array(n).fill(1).concat([1]));

    // Gaussian elimination
    for (let i = 0; i < n; i++) {
        let pivot = i;
        for (let j = i + 1; j < augmentedMatrix.length; j++) {
            if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[pivot][i])) {
                pivot = j;
            }
        }

        [augmentedMatrix[i], augmentedMatrix[pivot]] = [augmentedMatrix[pivot], augmentedMatrix[i]];

        for (let j = i + 1; j < augmentedMatrix.length; j++) {
            const factor = augmentedMatrix[j][i] / augmentedMatrix[i][i];
            for (let k = i; k <= n; k++) {
                augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
            }
        }
    }

    // Back substitution
    const coefficients = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = augmentedMatrix[i][n];
        for (let j = i + 1; j < n; j++) {
            sum -= augmentedMatrix[i][j] * coefficients[j];
        }
        coefficients[i] = Math.round(sum / augmentedMatrix[i][i]);
    }

    // Normalize coefficients to smallest possible integers
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const lcm = (a, b) => (a * b) / gcd(a, b);
    let factor = coefficients.reduce((acc, val) => lcm(acc, val), 1);
    coefficients.forEach((val, idx) => {
        coefficients[idx] = Math.abs(Math.round((val / factor) * 1000));
    });

    // Build balanced equation
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