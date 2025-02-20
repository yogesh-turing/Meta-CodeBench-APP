function parsePolynomial(polynomial) {
  const regex = /^\((\d+)x\^(\d+)\)\^(\d+)$/;
  const match = polynomial.match(regex);
  if (!match) {
    throw new Error("Invalid polynomial format. Expected (ax^b)^c");
  }
  const a = parseFloat(match[1]);
  const b = parseFloat(match[2]);
  const c = parseFloat(match[3]);
  return [a, b, c];
}

function chainRuleDerivative(polynomial) {
  try {
    const [a, b, c] = parsePolynomial(polynomial);
    const derivative = `${c}(${a}x^${b})^${c - 1} (${a * b}x^${b - 1})`;
    return `The derivative of the polynomial using chain rule is: ${derivative}`;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

module.exports = { chainRuleDerivative };