function validateEquation(equation) {
    // Remove all whitespace from the equation
    const cleanEquation = equation.replace(/\s/g, '');

    // Check if the equation is empty
    if (cleanEquation.length === 0) {
        return {
            isValid: false,
            errorMessage: 'Equation cannot be empty',
            errorIndex: -1,
            suggestion: 'Enter a valid equation'
        };
    }

    // Regular expression to validate the equation structure
    const validEquationRegex = /^[0-9+\-*/().]+$/;

    // Check if the equation contains only valid characters
    if (!validEquationRegex.test(cleanEquation)) {
        const invalidCharIndex = cleanEquation.search(/[^0-9+\-*/().]/);
        return {
            isValid: false,
            errorMessage: `Invalid character '${cleanEquation[invalidCharIndex]}' at position ${invalidCharIndex + 1}`,
            errorIndex: invalidCharIndex,
            suggestion: 'Remove or replace the invalid character'
        };
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
            return {
                isValid: false,
                errorMessage: `Unbalanced parentheses at position ${i + 1}`,
                errorIndex: i,
                suggestion: 'Add a matching opening parenthesis or remove the closing parenthesis'
            };
        }
    }

    // Ensure parentheses are balanced at the end
    if (parenthesesCount !== 0) {
        return {
            isValid: false,
            errorMessage: 'Unbalanced parentheses',
            errorIndex: -1,
            suggestion: 'Add a matching closing parenthesis'
        };
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
            const errorIndex = match.index;
            return {
                isValid: false,
                errorMessage: `Invalid operator sequence at position ${errorIndex + 1}`,
                errorIndex: errorIndex,
                suggestion: 'Remove or replace the invalid operator sequence'
            };
        }
    }

    // Check for division by zero
    if (cleanEquation.includes('/0')) {
        const errorIndex = cleanEquation.indexOf('/0');
        return {
            isValid: false,
            errorMessage: 'Division by zero at position ' + (errorIndex + 1),
            errorIndex: errorIndex,
            suggestion: 'Change the divisor to a non-zero value'
        };
    }

    // Check for decimal point usage
    if (cleanEquation.includes('.')) {
        const decimalPointIndex = cleanEquation.indexOf('.');
        if (decimalPointIndex === 0 || decimalPointIndex === cleanEquation.length - 1) {
            return {
                isValid: false,
                errorMessage: `Invalid decimal point usage at position ${decimalPointIndex + 1}`,
                errorIndex: decimalPointIndex,
                suggestion: 'Remove the decimal point or add a digit before or after it'
            };
        }
    }

    // If all checks pass, the equation is considered valid
    return {
        isValid: true,
        errorMessage: '',
        errorIndex: -1,
        suggestion: ''
    };
}

module.exports = { validateEquation };