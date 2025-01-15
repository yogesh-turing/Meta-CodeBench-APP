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

    // Check for invalid characters
    const validChars = /^[0-9+\-*/().]+$/;
    for (let i = 0; i < cleanEquation.length; i++) {
        if (!validChars.test(cleanEquation[i])) {
            return {
                isValid: false,
                errorMessage: `Invalid character '${cleanEquation[i]}' detected`,
                errorIndex: i,
                suggestion: "Use only numbers, operators (+, -, *, /), and parentheses"
            };
        }
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
                suggestion: "Ensure all opening parentheses have a matching closing parenthesis"
            };
        }
    }
    if (parenthesesCount !== 0) {
        return {
            isValid: false,
            errorMessage: "Unbalanced parentheses",
            errorIndex: cleanEquation.length - 1,
            suggestion: "Ensure all opening parentheses have a matching closing parenthesis"
        };
    }

    // Check for invalid sequences of operators
    const invalidOperatorSequences = [
        { regex: /[+\-*/]{2,}/, message: "Consecutive operators", suggestion: "Use only one operator between numbers or expressions" },
        { regex: /\(\)/, message: "Empty parentheses", suggestion: "Remove empty parentheses or add content between them" },
        { regex: /^[+*/]/, message: "Invalid starting operator", suggestion: "Start with a number, minus sign, or opening parenthesis" },
        { regex: /[+\-*/]$/, message: "Invalid ending operator", suggestion: "End with a number or closing parenthesis" }
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
    const divisionByZeroRegex = /\/0(?![.0-9])/;
    const divisionByZeroMatch = cleanEquation.match(divisionByZeroRegex);
    if (divisionByZeroMatch) {
        return {
            isValid: false,
            errorMessage: "Division by zero",
            errorIndex: divisionByZeroMatch.index,
            suggestion: "Replace the zero divisor with a non-zero number"
        };
    }

    // Check for proper decimal point usage
    const invalidDecimalRegex = /\d*\.\d*\./;
    const invalidDecimalMatch = cleanEquation.match(invalidDecimalRegex);
    if (invalidDecimalMatch) {
        return {
            isValid: false,
            errorMessage: "Invalid decimal point usage",
            errorIndex: invalidDecimalMatch.index,
            suggestion: "Use only one decimal point per number"
        };
    }

    // Check overall mathematical structure
    const validStructureRegex = /^(\(*-?\d+(\.\d+)?\)*([+\-*/]\(*-?\d+(\.\d+)?\)*)*)?$/;
    if (!validStructureRegex.test(cleanEquation)) {
        return {
            isValid: false,
            errorMessage: "Invalid equation structure",
            errorIndex: -1,
            suggestion: "Ensure the equation follows a valid mathematical structure"
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