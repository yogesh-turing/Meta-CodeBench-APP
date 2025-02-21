function parsePolynomial(polynomial) {
  // Remove the parentheses at the start and end of the string
  const trimmedPolynomial = polynomial.replace(/^$|$$/g, "");

  // Split the string into two parts: the inner polynomial and the outer exponent
  const [innerPolynomial, outerExponent] = trimmedPolynomial.split(")^");

  // Split the inner polynomial into the coefficient and the inner exponent
  const [coefficient, innerExponent] = innerPolynomial.split("x^");

  // Parse the coefficient, inner exponent, and outer exponent into numbers
  const a = coefficient !== "" ? parseFloat(coefficient) : 1;
  const b = parseFloat(innerExponent);
  const c = parseFloat(outerExponent);

  // Check if any of the numbers are NaN (not a number)
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw new Error("Invalid polynomial format");
  }

  // Return the parsed numbers as an array
  return [a, b, c];
}

function chainRuleDerivative(polynomial) {
  try {
    // Parse the polynomial into its components
    const [a, b, c] = parsePolynomial(polynomial);

    // Calculate the derivative using the chain rule
    const derivative = `${c * a * b}x^${b - 1}(${a}x^${b})^${c - 1}`;

    // Return the derivative as a string
    return `The derivative of the polynomial using the chain rule is: ${derivative}`;
  } catch (error) {
    // If there's an error parsing the polynomial, return an error message
    return error.message;
  }
}

module.exports = { chainRuleDerivative };