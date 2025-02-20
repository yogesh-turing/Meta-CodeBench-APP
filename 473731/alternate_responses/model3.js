function parseCompound(compound) {
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(compound)) {
        throw new Error("Invalid compound format");
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
        side.trim().split("+").map(comp => comp.trim())
    );

    const leftElements = {};
    const rightElements = {};

    reactants.forEach(compound => {
        const parsed = parseCompound(compound);
        Object.entries(parsed).forEach(([element, count]) => {
            leftElements[element] = (leftElements[element] || 0) + count;
        });
    });

    products.forEach(compound => {
        const parsed = parseCompound(compound);
        Object.entries(parsed).forEach(([element, count]) => {
            rightElements[element] = (rightElements[element] || 0) + count;
        });
    });

    return { leftElements, rightElements };
}

function balanceEquation(equation) {
    if (!equation.includes("->")) {
        throw new Error("Invalid equation format. Must contain ->");
    }

    const [reactants, products] = equation.split("->").map(side => 
        side.trim().split("+").map(comp => comp.trim())
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
    for (let i = 0; i < matrix.length; i++) {
        for (let j = i + 1; j < n - 1; j++) {
            const factor = matrix[i][j] / matrix[i][i];
            for (let k = i; k < matrix.length; k++) {
                matrix[k][j] -= factor * matrix[k][i];
            }
        }
    }

    // Back substitution to find coefficients
    const coefficients = new Array(n).fill(1);
    for (let i = matrix.length - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += matrix[i][j] * coefficients[j];
        }
        coefficients[i] = Math.round(-sum / matrix[i][i]);
        if (coefficients[i] === 0) coefficients[i] = 1;
    }

    // Ensure all coefficients are positive and minimize them
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    let factor = coefficients.reduce((a, b) => lcm(Math.abs(a), Math.abs(b)));
    coefficients.forEach((c, i) => {
        coefficients[i] = Math.abs(c * (factor / Math.abs(c)));
    });

    // Build balanced equation
    const balancedReactants = reactants.map((r, i) => 
        (coefficients[i] === 1 ? "" : coefficients[i]) + r
    ).join(" + ");
    
    const balancedProducts = products.map((p, i) => 
        (coefficients[i + reactants.length] === 1 ? "" : coefficients[i + reactants.length]) + p
    ).join(" + ");

    return `${balancedReactants} -> ${balancedProducts}`;
}

module.exports = { balanceEquation, parseCompound, parseEquation };