function parsePolynomial(polynomial) {
    // Remove outer parentheses if they exist
    const cleanedPoly = polynomial.replace(/^\(|\)$/g, "");
    
    // Split into coefficient and exponent parts
    const parts = cleanedPoly.split("x^");
    
    // Get inner coefficient (a)
    let innerCoeff = 1;  // default value if no coefficient is specified
    if (parts[0] && parts[0] !== "") {
        innerCoeff = parseFloat(parts[0]);
    }
    
    if (!parts[1]) {
        throw new Error("Invalid polynomial format. Expected format: (ax^b)^c");
    }
    
    // Split to get inner and outer exponents
    const exponents = parts[1].split(")^");
    if (exponents.length !== 2) {
        throw new Error("Invalid polynomial format. Expected format: (ax^b)^c");
    }
    
    const innerExp = parseFloat(exponents[0]);  // b
    const outerExp = parseFloat(exponents[1]);  // c
    
    if (isNaN(innerCoeff) || isNaN(innerExp) || isNaN(outerExp)) {
        throw new Error("Invalid polynomial: coefficients and exponents must be numbers");
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
        
        // Build the derivative string
        let derivative = `${outerExp}(${innerCoeff}x^${innerExp})^${newOuterExp} (${newInnerCoeff}`;
        
        // Add x term with exponent if needed
        if (newInnerExp !== 0) {
            derivative += `x^${newInnerExp}`;
        }
        derivative += ")";
        
        return "The derivative of the polynomial using chain rule is: " + derivative;
    } catch (error) {
        return error.message;
    }
}

module.exports = { chainRuleDerivative, parsePolynomial };