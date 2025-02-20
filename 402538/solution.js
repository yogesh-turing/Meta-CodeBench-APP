function parsePolynomial(polynomial) {
  const pattern = /^\((-?(?:\d+\.?\d*|\.\d+))?x\^([-+]?\d*\.?\d+)\)\^([-+]?\d*\.?\d+)$/;
  const match = polynomial.match(pattern);

  if (match) {
    let innerCoeff = 1;
    if (match[1] !== undefined) {
      innerCoeff = parseFloat(match[1]);
      if (isNaN(innerCoeff)) throw new Error("Invalid polynomial format.");
    }

    const innerExp = parseFloat(match[2]);
    const outerExp = parseFloat(match[3]);

    if (isNaN(innerExp) || isNaN(outerExp)) {
      throw new Error("Invalid polynomial format.");
    }

    return { innerCoeff, innerExp, outerExp };
  } else {
    throw new Error("Invalid polynomial format.");
  }
}

function chainRuleDerivative(polynomial) {
  try {
    const { innerCoeff, innerExp, outerExp } = parsePolynomial(polynomial);
    const newOuterExp = outerExp - 1;
    const newInnerCoeff = innerCoeff * innerExp;
    const newInnerExp = innerExp - 1;

    let derivative = `The derivative of the polynomial using chain rule is: ${outerExp}(${innerCoeff}x^${innerExp})^${newOuterExp} (${newInnerCoeff}x`;
    if (newInnerExp !== 0) {
      derivative += `^${newInnerExp}`;
    }
    derivative += ")";

    return derivative;
  } catch (e) {
    throw e;
  }
}

module.exports = { chainRuleDerivative };