function validateEquation(equation) {
    // Remove all whitespace from the equation
    const cleanEquation = equation.replace(/\s/g, '');

    // Check if the equation is empty
    if (cleanEquation.length === 0) {
        return {
            isValid: false,
            errorMessage: "Equation is empty",
            errorIndex: -1,
            suggestion: "Please enter a valid mathematical equation"
        };
    }

    // Regular expression to validate the equation structure
    const validEquationRegex = /^[0-9+\-*/().]+$/;

    // Check if the equation contains only valid characters
    if (!validEquationRegex.test(cleanEquation)) {
        const invalidChar = cleanEquation.match(/[^0-9+\-*/().]/)[0];
        const errorIndex = cleanEquation.indexOf(invalidChar);
        return {
            isValid: false,
            errorMessage: `Invalid character: ${invalidChar}`,
            errorIndex: errorIndex,
            suggestion: `Remove or replace the invalid character at position ${errorIndex + 1}`
        };
    }

    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (let i = 0; i < cleanEquation.length; i++) {
        if (cleanEquation[i] === '(') {
            parenthesesCount++;
        } else if (cleanEquation[i] === ')') {
            parenthesesCount--;
        }

        if (parenthesesCount < 0) {
            return {
                isValid: false,
                errorMessage: "Unbalanced parentheses",
                errorIndex: i,
                suggestion: "Add an opening parenthesis before this position"
            };
        }
    }

    if (parenthesesCount !== 0) {
        return {
            isValid: false,
            errorMessage: "Unbalanced parentheses",
            errorIndex: cleanEquation.length - 1,
            suggestion: "Add closing parentheses at the end of the equation"
        };
    }

    // Check for invalid sequences of operators
    const invalidOperatorSequences = [
        { regex: /[+\-*/]{2,}/, message: "Consecutive operators", suggestion: "Remove one of the consecutive operators" },
        { regex: /\(\)/, message: "Empty parentheses", suggestion: "Remove empty parentheses or add content between them" },
        { regex: /^[+*/]/, message: "Invalid starting operator", suggestion: "Remove the operator at the beginning or start with a number or opening parenthesis" },
        { regex: /[+\-*/]$/, message: "Invalid ending operator", suggestion: "Remove the operator at the end or add a number after it" }
    ];

    for (let { regex, message, suggestion } of invalidOperatorSequences) {
        const match = cleanEquation.match(regex);
        if (match) {
            return {
                isValid: false,
                errorMessage: message,
                errorIndex: match.index,
                suggestion: suggestion
            };
        }
    }

    // Check for division by zero
    const divisionByZeroMatch = cleanEquation.match(/\/0(?![.0-9])/);
    if (divisionByZeroMatch) {
        return {
            isValid: false,
            errorMessage: "Division by zero",
            errorIndex: divisionByZeroMatch.index,
            suggestion: "Replace the zero with a non-zero number"
        };
    }

    // Check for invalid decimal point usage
    const invalidDecimalMatch = cleanEquation.match(/\d*\.\d*\./);
    if (invalidDecimalMatch) {
        return {
            isValid: false,
            errorMessage: "Invalid decimal point usage",
            errorIndex: invalidDecimalMatch.index,
            suggestion: "Use only one decimal point per number"
        };
    }

    // Check for overall mathematical structure
    if (!/^\d/.test(cleanEquation) && !/^\(/.test(cleanEquation) && !/^-/.test(cleanEquation)) {
        return {
            isValid: false,
            errorMessage: "Invalid equation structure",
            errorIndex: 0,
            suggestion: "Start the equation with a number, opening parenthesis, or negative sign"
        };
    }

    // If all checks pass, the equation is considered valid
    return {
        isValid: true,
        errorMessage: null,
        errorIndex: -1,
        suggestion: null
    };
}

module.exports = { validateEquation };