function parsePolynomial(polynomial) {
    // Remove outer parentheses if they exist
    polynomial = polynomial.trim();
    
    // Check basic format
    const format = /^\([-]?\d*\.?\d*x\^\d+\)\^[-]?\d+$/;
    if (!format.test(polynomial)) {
        throw new Error("Invalid polynomial format. Expected format: (ax^b)^c");
    }

    // Remove outer parentheses
    polynomial = polynomial.replace(/^\(|\)$/g, "");
    
    // Split into parts
    const parts = polynomial.split("x^");
    
    // Extract inner coefficient (a)
    let innerCoeff = parts[0] === "" ? 1 : parseFloat(parts[0]);
    if (parts[0] === "-") innerCoeff = -1;
    
    // Split the remaining part to get inner and outer exponents
    const exponents = parts[1].split(")^");
    const innerExp = parseFloat(exponents[0]);
    const outerExp = parseFloat(exponents[1]);
    
    // Validate numbers
    if (isNaN(innerCoeff) || isNaN(innerExp) || isNaN(outerExp)) {
        throw new Error("Invalid numbers in polynomial");
    }
    
    return [innerCoeff, innerExp, outerExp];
}

function chainRuleDerivative(polynomial) {
    try {
        // Parse the polynomial
        const [innerCoeff, innerExp, outerExp] = parsePolynomial(polynomial);
        
        // Calculate derivative components
        const newOuterExp = outerExp - 1;
        const newInnerCoeff = innerCoeff * innerExp;
        const newInnerExp = innerExp - 1;
        
        // Construct the derivative string
        let derivative = `${outerExp}(${innerCoeff}x^${innerExp})^${newOuterExp} `;
        
        // Add the second part
        derivative += `(${newInnerCoeff}`;
        if (newInnerExp !== 0) {
            derivative += `x^${newInnerExp}`;
        }
        derivative += ")";
        
        return "The derivative of the polynomial using chain rule is: " + derivative;
    } catch (error) {
        return error.message;
    }
}

module.exports = { parsePolynomial, chainRuleDerivative };