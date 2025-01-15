function validateEquation(equation) {
    const result = {
        isValid: true,
        errorMessage: '',
        errorIndex: -1,
        suggestion: ''
    };

    // Remove all whitespace from the equation
    const cleanEquation = equation.replace(/\s/g, '');

    // Check if the equation is empty
    if (cleanEquation.length === 0) {
        result.isValid = false;
        result.errorMessage = 'Equation is empty';
        result.suggestion = 'Enter a valid mathematical equation';
        return result;
    }

    // Regular expression to validate the equation structure
    const validEquationRegex = /^[0-9+\-*/().]+$/;

    // Check if the equation contains only valid characters
    if (!validEquationRegex.test(cleanEquation)) {
        const invalidCharIndex = cleanEquation.search(/[^0-9+\-*/().]/);
        result.isValid = false;
        result.errorMessage = `Invalid character '${cleanEquation[invalidCharIndex]}' at position ${invalidCharIndex}`;
        result.errorIndex = invalidCharIndex;
        result.suggestion = `Remove or replace the invalid character '${cleanEquation[invalidCharIndex]}'`;
        return result;
    }

    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (let i = 0; i < cleanEquation.length; i++) {
        const char = cleanEquation[i];
        if (char === '(') {
            parenthesesCount++;
        } else if (char === ')') {
            parenthesesCount--;
        }

        // If at any point we have more closing than opening parentheses, it's invalid
        if (parenthesesCount < 0) {
            result.isValid = false;
            result.errorMessage = `Unbalanced parentheses at position ${i}`;
            result.errorIndex = i;
            result.suggestion = 'Ensure parentheses are properly balanced';
            return result;
        }
    }

    // Ensure parentheses are balanced at the end
    if (parenthesesCount !== 0) {
        result.isValid = false;
        result.errorMessage = 'Unbalanced parentheses';
        result.errorIndex = cleanEquation.lastIndexOf('(');
        result.suggestion = 'Ensure parentheses are properly balanced';
        return result;
    }

    // Check for invalid sequences of operators
    const invalidOperatorSequences = [
        /[+\-/]{2,}/,  // Two or more consecutive operators
        /\(\)/,         // Empty parentheses
        /^[+/]/,       // Starting with an operator other than minus or opening parenthesis
        /[+\-*/]$/,     // Ending with an operator
    ];

    for (let regex of invalidOperatorSequences) {
        const match = cleanEquation.match(regex);
        if (match) {
            result.isValid = false;
            result.errorMessage = `Invalid operator sequence '${match[0]}' at position ${match.index}`;
            result.errorIndex = match.index;
            result.suggestion = `Remove or replace the invalid operator sequence '${match[0]}'`;
            return result;
        }
    }

    // Check for division by zero
    if (cleanEquation.includes('/0')) {
        const divisionByZeroIndex = cleanEquation.indexOf('/0');
        result.isValid = false;
        result.errorMessage = `Division by zero at position ${divisionByZeroIndex}`;
        result.errorIndex = divisionByZeroIndex;
        result.suggestion = 'Replace the divisor with a non-zero value';
        return result;
    }

    // Check for decimal point usage
    if (cleanEquation.includes('.')) {
        const decimalPointIndex = cleanEquation.indexOf('.');
        if (decimalPointIndex === 0 || decimalPointIndex === cleanEquation.length - 1) {
            result.isValid = false;
            result.errorMessage = `Invalid decimal point usage at position ${decimalPointIndex}`;
            result.errorIndex = decimalPointIndex;
            result.suggestion = 'Ensure decimal points are used correctly';
            return result;
        }
    }

    // If all checks pass, the equation is considered valid
    return result;
}

module.exports = { validateEquation };