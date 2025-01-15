function validateEquation(equation) {
    // Remove all whitespace from the equation
    const cleanEquation = equation.replace(/\s/g, '');

    // Check if the equation is empty
    if (cleanEquation.length === 0) {
        return {
            isValid: false,
            errorMessage: 'The equation is empty',
            errorIndex: 0,
            suggestion: 'Please enter a mathematical expression',
        };
    }

    // Regular expression to validate the equation structure
    const validEquationRegex = /^[0-9+\-*/().]+$/;

    // Check if the equation contains only valid characters
    if (!validEquationRegex.test(cleanEquation)) {
        const invalidCharIndex = cleanEquation.search(/[^0-9+\-*/().]/);
        return {
            isValid: false,
            errorMessage: `Invalid character '${cleanEquation[invalidCharIndex]}' found`,
            errorIndex: invalidCharIndex,
            suggestion: 'Please remove the invalid character',
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
                errorMessage: 'Unbalanced parentheses',
                errorIndex: i,
                suggestion: 'Please balance the parentheses',
            };
        }
    }

    // Ensure parentheses are balanced at the end
    if (parenthesesCount !== 0) {
        return {
            isValid: false,
            errorMessage: 'Unbalanced parentheses',
            errorIndex: cleanEquation.length - 1,
            suggestion: 'Please balance the parentheses',
        };
    }

    // Check for invalid sequences of operators
    const invalidOperatorSequences = [
        {
            regex: /[+\-/]{2,}/,
            errorMessage: 'Consecutive operators are not allowed',
            suggestion: 'Please separate operators with numbers or parentheses',
        },
        {
            regex: /\(\)/,
            errorMessage: 'Empty parentheses are not allowed',
            suggestion: 'Please remove the empty parentheses',
        },
        {
            regex: /^[+/]/,
            errorMessage: 'Equation cannot start with an operator other than minus or opening parenthesis',
            suggestion: 'Please start the equation with a number, minus, or opening parenthesis',
        },
        {
            regex: /[+\-*/]$/,
            errorMessage: 'Equation cannot end with an operator',
            suggestion: 'Please end the equation with a number or closing parenthesis',
        },
    ];

    for (const { regex, errorMessage, suggestion } of invalidOperatorSequences) {
        const match = cleanEquation.match(regex);
        if (match) {
            return {
                isValid: false,
                errorMessage,
                errorIndex: match.index,
                suggestion,
            };
        }
    }

    // Check for division by zero
    if (cleanEquation.includes('/0')) {
        const divisionIndex = cleanEquation.indexOf('/0');
        return {
            isValid: false,
            errorMessage: 'Division by zero is not allowed',
            errorIndex: divisionIndex,
            suggestion: 'Please change the divisor to a non-zero value',
        };
    }

    // Check for invalid decimal point usage
    if (cleanEquation.includes('.')) {
        const decimalIndex = cleanEquation.indexOf('.');
        if (decimalIndex === 0 || decimalIndex === cleanEquation.length - 1) {
            return {
                isValid: false,
                errorMessage: 'Decimal point cannot be at the start or end of the equation',
                errorIndex: decimalIndex,
                suggestion: 'Please place the decimal point within a number',
            };
        }

        if (cleanEquation[decimalIndex - 1] !== ')' && isNaN(parseInt(cleanEquation[decimalIndex - 1]))) {
            return {
                isValid: false,
                errorMessage: 'Decimal point must be preceded by a digit',
                errorIndex: decimalIndex,
                suggestion: 'Please place the decimal point after a digit',
            };
        }

        if (cleanEquation[decimalIndex + 1] !== '(' && isNaN(parseInt(cleanEquation[decimalIndex + 1]))) {
            return {
                isValid: false,
                errorMessage: 'Decimal point must be followed by a digit',
                errorIndex: decimalIndex,
                suggestion: 'Please place the decimal point before a digit',
            };
        }
    }

    // If all checks pass, the equation is considered valid
    return {
        isValid: true,
        errorMessage: '',
        errorIndex: -1,
        suggestion: '',
    };
}

module.exports = { validateEquation };