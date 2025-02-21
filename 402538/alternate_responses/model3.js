function parsePolynomial(polynomial) {
    // Remove whitespace and validate basic format
    polynomial = polynomial.trim();
    if (!/^$[^()]+$\^-?\d+$/.test(polynomial)) {
        throw new Error("Invalid polynomial format. Expected format: (ax^b)^c");
    }

    // Remove outer parentheses
    const innerPart = polynomial.replace(/^$|$$/g, "");
    
    // Split into coefficient and exponent parts
    const [coefficientPart, exponentPart] = innerPart.split("x^");
    
    // Extract inner coefficient (a)
    const innerCoefficient = coefficientPart === "" ? 1 : 
                            coefficientPart === "-" ? -1 : 
                            parseFloat(coefficientPart);
    
    // Split the exponent parts to get inner (b) and outer (c) exponents
    const [innerExponent, outerExponent] = exponentPart.split(")^");
    
    // Parse the exponents
    const innerExp = parseFloat(innerExponent);
    const outerExp = parseFloat(outerExponent);
    
    // Validate all numbers
    if (isNaN(innerCoefficient) || isNaN(innerExp) || isNaN(outerExp)) {
        throw new Error("Invalid numbers in polynomial");
    }
    
    return [innerCoefficient, innerExp, outerExp];
}

function chainRuleDerivative(polynomial) {
    try {
        // Parse the polynomial
        const [a, b, c] = parsePolynomial(polynomial);
        
        // Calculate derivative components
        const outerPower = c - 1;
        const innerCoefficient = a * b;
        const innerPower = b - 1;
        
        // Build the derivative string
        let derivative = `${c}(${a}x^${b})^${outerPower} (${innerCoefficient}`;
        
        // Add x term if inner power isn't 0
        if (innerPower !== 0) {
            derivative += `x^${innerPower}`;
        }
        
        derivative += ")";
        
        return `The derivative of the polynomial using chain rule is: ${derivative}`;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

module.exports = { parsePolynomial, chainRuleDerivative };