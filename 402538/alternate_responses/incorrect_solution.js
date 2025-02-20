function parsePolynomial(polynomial) {
  const regex = /^$([\d.]+)x\^([\d.]+)$\^([\d.]+)$/;
  const match = polynomial.match(regex);
  if (!match) {
    throw new Error("Invalid input format. Please use the format (ax^b)^c.");
  }
  const innerCoefficient = parseFloat(match[1]);
  const innerExponent = parseFloat(match[2]);
  const outerExponent = parseFloat(match[3]);
  return [innerCoefficient, innerExponent, outerExponent];
}

function chainRuleDerivative(innerCoefficient, innerExponent, outerExponent) {
  const newOuterExponent = outerExponent - 1;
  const innerDerivativeCoefficient = innerCoefficient * innerExponent;
  const newInnerExponent = innerExponent - 1;

  const formattedOuterExp = outerExponent.toFixed(0);
  const formattedInnerCoeff = innerCoefficient.toFixed(0);
  const formattedInnerExp = innerExponent.toFixed(0);
  const formattedNewOuterExp = newOuterExponent.toFixed(0);
  const formattedInnerDerivCoeff = innerDerivativeCoefficient.toFixed(0);
  const formattedNewInnerExp = newInnerExponent.toFixed(0);

  return `${formattedOuterExp}(${formattedInnerCoeff}x^${formattedInnerExp})^${formattedNewOuterExp} * ${formattedInnerDerivCoeff}x^${formattedNewInnerExp}`;
}

module.exports = { chainRuleDerivative };