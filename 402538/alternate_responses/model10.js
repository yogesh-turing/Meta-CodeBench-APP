function parsePolynomial(polynomial) {
    var regex = /$([-+]?\d*)x\^([-+]?\d+)$\^([-+]?\d+)/;
    var match = polynomial.match(regex);
    if (!match) {
        throw new Error("Invalid polynomial format");
    }
    var coefficient = parseFloat(match[1]) || 1;
    var innerExponent = parseFloat(match[2]);
    var outerExponent = parseFloat(match[3]);
    return [coefficient, innerExponent, outerExponent];
}

function chainRuleDerivative(polynomial) {
    try {
        var [coefficient, innerExponent, outerExponent] = parsePolynomial(polynomial);
        var newOuterExponent = outerExponent - 1;
        var newCoefficient = coefficient * outerExponent;
        var derivative = `${newCoefficient}x^${innerExponent * newOuterExponent} (${coefficient}x^${innerExponent})^${newOuterExponent}`;
        return derivative;
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    chainRuleDerivative,
    parsePolynomial
};