function parsePolynomial(polynomial) {
    // Remove outer parentheses if they exist
    polynomial = polynomial.trim();
    
    // Check if the input matches the expected format using regex
    const polynomialRegex = /^\((-?\d*\.?\d*)x\^(-?\d+)\)\^(-?\d+)$/;
    const matches = polynomial.match(polynomialRegex);
    
    if (!matches) {
        throw new Error("Invalid polynomial format. Expected format: (ax^b)^c");
    }
    
    // Extract coefficients and exponents
    let innerCoefficient = matches[1];
    const innerExponent = parseFloat(matches[2]);
    const outerExponent = parseFloat(matches[3]);
    
    // Handle cases where coefficient is implicit
    if (innerCoefficient === '') innerCoefficient = '1';
    if (innerCoefficient === '-') innerCoefficient = '-1';
    
    innerCoefficient = parseFloat(innerCoefficient);
    
    // Validate numbers
    if (isNaN(innerCoefficient) || isNaN(innerExponent) || isNaN(outerExponent)) {
        throw new Error("Invalid numbers in polynomial");
    }
    
    return [innerCoefficient, innerExponent, outerExponent];
}

function chainRuleDerivative(polynomial) {
    try {
        // Parse the polynomial
        const [innerCoefficient, innerExponent, outerExponent] = parsePolynomial(polynomial);
        
        // Calculate derivative components
        const newOuterExponent = outerExponent - 1;
        const newInnerCoefficient = innerCoefficient * innerExponent;
        const newInnerExponent = innerExponent - 1;
        
        // Build the derivative string
        let derivative = `${outerExponent}(${innerCoefficient}x^${innerExponent})^${newOuterExponent} `;
        derivative += `(${newInnerCoefficient}`;
        
        if (newInnerExponent !== 0) {
            derivative += `x^${newInnerExponent}`;
        }
        
        derivative += ')';
        
        return `The derivative of the polynomial using chain rule is: ${derivative}`;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

module.exports = { chainRuleDerivative, parsePolynomial };