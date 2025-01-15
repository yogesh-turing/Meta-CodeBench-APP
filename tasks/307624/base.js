function validateEquation(equation) {
    // Remove all whitespace from the equation
    const cleanEquation = equation.replace(/\s/g, '');

    // Check if the equation is empty
    if (cleanEquation.length === 0) {
        return false;
    }

    // Regular expression to validate the equation structure
    const validEquationRegex = /^[0-9+\-*/().]+$/;

    // Check if the equation contains only valid characters
    if (!validEquationRegex.test(cleanEquation)) {
        return false;
    }

    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (let char of cleanEquation) {
        if (char === '(') {
            parenthesesCount++;
        } else if (char === ')') {
            parenthesesCount--;
        }

        // If at any point we have more closing than opening parentheses, it's invalid
        if (parenthesesCount < 0) {
            return false;
        }
    }

    // Ensure parentheses are balanced at the end
    if (parenthesesCount !== 0) {
        return false;
    }

    // Check for invalid sequences of operators
    const invalidOperatorSequences = [
        /[+\-/]{2,}/,  // Two or more consecutive operators
        /\(\)/,         // Empty parentheses
        /^[+/]/,       // Starting with an operator other than minus or opening parenthesis
        /[+\-*/]$/,     // Ending with an operator
    ];

    for (let regex of invalidOperatorSequences) {
        if (regex.test(cleanEquation)) {
            return false;
        }
    }

    if (cleanEquation.includes('/0')) {
        return false;
    }

    // If all checks pass, the equation is considered valid
    return true;
}

module.exports = {validateEquation};