function parsePolynomial(polynomial) {
  const b = polynomial.replace(/^\(|\)$/g, "");
  const c = b.split("x^");
  const d = 1;
  c[0] && c[0] !== "" && (d = parseFloat(c[0]));
  const e = c[1].split(")^");
  const f = parseFloat(e[0]);
  const g = parseFloat(e[1]);
  if (isNaN(d) || isNaN(f) || isNaN(g)) {
    throw new Error("Invalid polynomial");
  }
  return [d, f, g];
}

function chainRuleDerivative(polynomial) {
  try {
    const [d, f, g] = parsePolynomial(polynomial);
    const h = g - 1;
    const i = d * f;
    const j = f - 1;
    let k = g + "(" + d + "x^" + f + ")^" + h + " (" + i + "x";
    j !== 0 && (k += "^" + j);
    k += ")";
    return "The derivative of the polynomial using chain rule is: " + k;
  } catch (error) {
    return error.message;
  }
}

module.exports = { chainRuleDerivative, parsePolynomial };