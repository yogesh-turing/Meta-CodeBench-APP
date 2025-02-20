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
    if (!equation.includes('->')) {
        throw new Error('Invalid equation format. Must contain ->');
    }

    const [reactants, products] = equation.split('->').map(side => 
        side.trim().split('+').map(compound => compound.trim())
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

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function balanceEquation(equation) {
    if (!equation.includes('->')) {
        throw new Error('Invalid equation format. Must contain ->');
    }

    const [reactants, products] = equation.split('->').map(side => 
        side.trim().split('+').map(compound => compound.trim())
    );

    // Get all unique elements
    const elements = new Set();
    [...reactants, ...products].forEach(compound => {
        Object.keys(parseCompound(compound)).forEach(element => elements.add(element));
    });

    // Create coefficient matrix
    const matrix = [];
    elements.forEach(element => {
        const row = [];
        reactants.forEach(compound => {
            const parsed = parseCompound(compound);
            row.push(parsed[element] || 0);
        });
        products.forEach(compound => {
            const parsed = parseCompound(compound);
            row.push(-(parsed[element] || 0));
        });
        matrix.push(row);
    });

    // Solve using Gaussian elimination
    const n = reactants.length + products.length;
    const augmented = matrix.map(row => [...row, 0]);
    
    // Add constraint that first coefficient is 1
    const constraintRow = new Array(n).fill(0);
    constraintRow[0] = 1;
    augmented.push([...constraintRow, 1]);

    // Solve system of equations
    for (let i = 0; i < augmented.length; i++) {
        let pivot = augmented[i][i];
        if (pivot === 0) continue;

        for (let j = i + 1; j < augmented.length; j++) {
            const factor = augmented[j][i] / pivot;
            for (let k = i; k <= n; k++) {
                augmented[j][k] -= factor * augmented[i][k];
            }
        }
    }

    // Back substitution
    const coefficients = new Array(n).fill(1);
    for (let i = augmented.length - 1; i >= 0; i--) {
        let sum = augmented[i][n];
        for (let j = i + 1; j < n; j++) {
            sum -= augmented[i][j] * coefficients[j];
        }
        if (augmented[i][i] !== 0) {
            coefficients[i] = sum / augmented[i][i];
        }
    }

    // Convert to integers
    let lcmVal = 1;
    coefficients.forEach(coef => {
        const denominator = String(coef).split('.')[1]?.length || 0;
        if (denominator > 0) {
            lcmVal = lcm(lcmVal, Math.pow(10, denominator));
        }
    });

    const intCoefficients = coefficients.map(coef => Math.round(coef * lcmVal));
    
    // Build balanced equation
    const balancedReactants = reactants.map((r, i) => 
        (intCoefficients[i] === 1 ? '' : intCoefficients[i]) + r
    ).join(' + ');
    
    const balancedProducts = products.map((p, i) => 
        (intCoefficients[i + reactants.length] === 1 ? '' : intCoefficients[i + reactants.length]) + p
    ).join(' + ');

    return `${balancedReactants} -> ${balancedProducts}`;
}

module.exports = { balanceEquation, parseCompound, parseEquation };