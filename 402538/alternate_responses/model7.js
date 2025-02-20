function parsePolynomial(polynomial) {
  // Remove the outer parentheses
  const trimmedPolynomial = polynomial.replace(/^\(|\)$/g, "");

  // Split the polynomial into two parts at the ')^' delimiter
  const [innerPolynomial, outerExponent] = trimmedPolynomial.split(")^");

  // Extract the inner coefficient and exponent
  const [innerCoefficient, innerExponent] = innerPolynomial.split("x^");

  // Parse the inner coefficient, inner exponent, and outer exponent into numbers
  const a = parseFloat(innerCoefficient);
  const b = parseFloat(innerExponent);
  const c = parseFloat(outerExponent);

  // Check if the input format is invalid
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw new Error("Invalid polynomial");
  }

  // Return an array containing the inner coefficient, inner exponent, and outer exponent
  return [a, b, c];
}

function chainRuleDerivative(polynomial) {
  try {
    // Parse the polynomial using the parsePolynomial function
    const [a, b, c] = parsePolynomial(polynomial);

    // Calculate the derivative using the chain rule
    const derivative = `${a * b * c}x^${b - 1}(${a}x^${b})^${c - 1}`;

    // Return the derivative as a string
    return `The derivative of the polynomial using chain rule is: ${derivative}`;
  } catch (error) {
    // If the input format is invalid, return an error message
    return error.message;
  }
}

// Export the chainRuleDerivative function
module.exports = { chainRuleDerivative };