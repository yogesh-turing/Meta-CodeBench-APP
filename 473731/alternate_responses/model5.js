function parseCompound(compound) {
    if (!/^[A-Za-z0-9()]+$/.test(compound)) {
        throw new Error("Invalid compound format");
    }

    const elements = {};
    let i = 0;

    while (i < compound.length) {
        if (compound[i] === '(') {
            let parenthesesCount = 1;
            let j = i + 1;
            while (j < compound.length && parenthesesCount > 0) {
                if (compound[j] === '(') parenthesesCount++;
                if (compound[j] === ')') parenthesesCount--;
                j++;
            }
            if (parenthesesCount !== 0) throw new Error("Unmatched parentheses");
            
            const subCompound = compound.slice(i + 1, j - 1);
            let multiplier = '';
            while (j < compound.length && /[0-9]/.test(compound[j])) {
                multiplier += compound[j];
                j++;
            }
            multiplier = multiplier ? parseInt(multiplier) : 1;
            
            const subElements = parseCompound(subCompound);
            for (const [element, count] of Object.entries(subElements)) {
                elements[element] = (elements[element] || 0) + count * multiplier;
            }
            i = j;
        } else if (/[A-Z]/.test(compound[i])) {
            let element = compound[i];
            i++;
            while (i < compound.length && /[a-z]/.test(compound[i])) {
                element += compound[i];
                i++;
            }
            
            let number = '';
            while (i < compound.length && /[0-9]/.test(compound[i])) {
                number += compound[i];
                i++;
            }
            
            const count = number ? parseInt(number) : 1;
            elements[element] = (elements[element] || 0) + count;
        } else {
            i++;
        }
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

    // Find the null space using Gaussian elimination
    const n = reactants.length + products.length;
    for (let i = 0; i < matrix.length; i++) {
        let pivot = matrix[i][i];
        let pivotRow = i;
        
        // Find non-zero pivot
        for (let j = i + 1; j < matrix.length && pivot === 0; j++) {
            if (matrix[j][i] !== 0) {
                pivot = matrix[j][i];
                pivotRow = j;
            }
        }
        
        if (pivotRow !== i) {
            [matrix[i], matrix[pivotRow]] = [matrix[pivotRow], matrix[i]];
        }
        
        for (let j = i + 1; j < matrix.length; j++) {
            const factor = matrix[j][i] / matrix[i][i];
            for (let k = i; k < n; k++) {
                matrix[j][k] -= factor * matrix[i][k];
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
        if (matrix[i][i] !== 0) {
            coefficients[i] = Math.round(-sum / matrix[i][i]);
        }
    }

    // Find the smallest positive integer coefficients
    const gcd = (...arr) => {
        const _gcd = (x, y) => (!y ? x : gcd(y, x % y));
        return arr.reduce((a, b) => _gcd(a, b));
    };

    const lcm = (...arr) => {
        const _lcm = (x, y) => (x * y) / gcd(x, y);
        return arr.reduce((a, b) => _lcm(a, b));
    };

    const multiplier = lcm(...coefficients.map(c => Math.abs(c)));
    const finalCoefficients = coefficients.map(c => Math.abs(c * multiplier / gcd(...coefficients.map(Math.abs))));

    // Construct the balanced equation
    const balancedReactants = reactants.map((r, i) => 
        (finalCoefficients[i] === 1 ? '' : finalCoefficients[i]) + r
    ).join(" + ");
    
    const balancedProducts = products.map((p, i) => 
        (finalCoefficients[i + reactants.length] === 1 ? '' : finalCoefficients[i + reactants.length]) + p
    ).join(" + ");

    return `${balancedReactants} -> ${balancedProducts}`;
}

module.exports = { balanceEquation, parseCompound, parseEquation };