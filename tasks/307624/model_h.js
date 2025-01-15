function validateEquation(equation) {
    // Initialize the result object with default values
    const result = {
        isValid: true,
        errorMessage: '',
        errorIndex: -1,
        suggestion: '',
    };

    // Remove all whitespace from the equation
    const cleanEquation = equation.replace(/\s/g, '');

    // Check if the equation is empty
    if (cleanEquation.length === 0) {
        result.isValid = false;
        result.errorMessage = 'Equation cannot be empty';
        result.suggestion = 'Please enter a valid equation';
        return result;
    }

    // Regular expression to validate the equation structure
    const validEquationRegex = /^[0-9+\-*/().]+$/;

    // Check if the equation contains only valid characters
    if (!validEquationRegex.test(cleanEquation)) {
        const invalidCharIndex = cleanEquation.search(/[^0-9+\-*/().]/);
        result.isValid = false;
        result.errorMessage = `Invalid character '${cleanEquation[invalidCharIndex]}' found at index ${invalidCharIndex}`;
        result.errorIndex = invalidCharIndex;
        result.suggestion = 'Please remove or replace the invalid character';
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
            result.errorMessage = 'Unbalanced parentheses';
            result.errorIndex = i;
            result.suggestion = 'Please balance the parentheses';
            return result;
        }
    }

    // Ensure parentheses are balanced at the end
    if (parenthesesCount !== 0) {
        result.isValid = false;
        result.errorMessage = 'Unbalanced parentheses';
        result.errorIndex = cleanEquation.length - 1;
        result.suggestion = 'Please balance the parentheses';
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
            result.errorMessage = 'Invalid operator sequence';
            result.errorIndex = match.index;
            result.suggestion = 'Please correct the operator sequence';
            return result;
        }
    }

    // Check for division by zero
    if (cleanEquation.includes('/0')) {
        const divisionIndex = cleanEquation.indexOf('/0');
        result.isValid = false;
        result.errorMessage = 'Division by zero';
        result.errorIndex = divisionIndex;
        result.suggestion = 'Please avoid division by zero';
        return result;
    }

    // Check for decimal point usage
    if (cleanEquation.includes('.')) {
        const decimalIndex = cleanEquation.indexOf('.');
        if (cleanEquation[decimalIndex - 1] === '.') {
            result.isValid = false;
            result.errorMessage = 'Invalid decimal point usage';
            result.errorIndex = decimalIndex;
            result.suggestion = 'Please correct the decimal point usage';
            return result;
        }
    }

    // If all checks pass, the equation is considered valid
    return result;
}

module.exports = { validateEquation };