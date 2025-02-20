function parsePolynomial(polynomial) {
    // Remove outer parentheses and validate basic format
    const regex = /^\(([-]?\d*\.?\d*)?x\^([-]?\d+)\)\^([-]?\d+)$/;
    const match = polynomial.match(regex);
    
    if (!match) {
        throw new Error("Invalid polynomial format. Expected format: (ax^b)^c");
    }

    // Extract coefficients and exponents
    let innerCoefficient = match[1];
    const innerExponent = parseFloat(match[2]);
    const outerExponent = parseFloat(match[3]);

    // Handle default coefficient (when no number is before x)
    innerCoefficient = innerCoefficient === '' ? 1 : 
                      innerCoefficient === '-' ? -1 : 
                      parseFloat(innerCoefficient);

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

        // Construct the derivative string
        let derivative = `${outerExponent}(${innerCoefficient}x^${innerExponent})^${newOuterExponent} `;
        derivative += `(${newInnerCoefficient}`;
        
        if (newInnerExponent !== 0) {
            derivative += `x^${newInnerExponent}`;
        }
        
        derivative += ')';

        return "The derivative of the polynomial using chain rule is: " + derivative;
    } catch (error) {
        return error.message;
    }
}

module.exports = { chainRuleDerivative, parsePolynomial };