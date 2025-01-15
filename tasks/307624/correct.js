function validateEquation(equation) {
    // Remove all whitespace from the equation
    const cleanEquation = equation.replace(/\s/g, "");
  
    // Validation result object
    const result = {
      isValid: true,
      errorMessage: "",
      errorIndex: -1,
      suggestion: "",
    };
  
    // Edge Case 1: Empty equation
    if (cleanEquation.length === 0) {
      result.isValid = false;
      result.errorMessage = "Empty equation";
      result.suggestion = "Please enter a valid mathematical expression";
      return result;
    }
  
    // Edge Case 2: Invalid characters
    const validCharRegex = /^[0-9+\-*/().]+$/;
    if (!validCharRegex.test(cleanEquation)) {
      result.isValid = false;
      const invalidCharMatch = cleanEquation.match(/[^0-9+\-*/().]/);
      result.errorMessage = `Invalid character found: '${invalidCharMatch[0]}'`;
      result.errorIndex = cleanEquation.indexOf(invalidCharMatch[0]);
      result.suggestion =
        "Remove or replace invalid characters. Only numbers, +, -, *, /, (, and ) are allowed.";
  
      return result;
    }
  
    // Edge Case 3: Balanced Parentheses
    let parenthesesStack = [];
    for (let i = 0; i < cleanEquation.length; i++) {
      const char = cleanEquation[i];
      if (char === "(") {
        // Edge Case: Consecutive opening parentheses
        if (
          parenthesesStack.length > 0 &&
          cleanEquation[parenthesesStack[parenthesesStack.length - 1]] === "("
        ) {
          result.isValid = false;
          result.errorMessage = "Consecutive opening parentheses";
          result.errorIndex = i;
          result.suggestion =
            "Remove extra opening parentheses or add a value between them";
          return result;
        }
        parenthesesStack.push(i);
      } else if (char === ")") {
        // Edge Case: Unmatched closing parentheses
        if (parenthesesStack.length === 0) {
          result.isValid = false;
          result.errorMessage = "Unmatched closing parentheses";
          result.errorIndex = i;
          result.suggestion =
            "Check that all closing parentheses have a corresponding opening parentheses";
          return result;
        }
        parenthesesStack.pop();
      }
    }
  
    // Edge Case 4: Unclosed parentheses
    if (parenthesesStack.length > 0) {
      result.isValid = false;
      result.errorMessage = "Unclosed parentheses";
      result.errorIndex = parenthesesStack[0];
      result.suggestion =
        "Add closing parentheses for each unclosed opening parentheses";
      return result;
    }
  
    // Edge Case 5: Multiple Invalid Sequences
    const invalidSequences = [
      {
        regex: /[+\-*/]{2,}/,
        message: "Multiple consecutive operators",
        suggestion: "Remove extra operators or check operator placement",
      },
      {
        regex: /\(\)/,
        message: "Empty parentheses",
        suggestion: "Remove empty parentheses or add a value inside them",
      },
      {
        regex: /^[+*/]/,
        message: "Equation cannot start with this operator",
        suggestion: "Start the equation with a number or an opening parentheses",
      },
      {
        regex: /[+\-*/]$/,
        message: "Equation cannot end with an operator",
        suggestion: "End the equation with a number or a closing parentheses",
      },
    ];
  
    for (let seq of invalidSequences) {
      const match = cleanEquation.match(seq.regex);
      if (match) {
        result.isValid = false;
        result.errorMessage = seq.message;
        result.errorIndex = match.index;
        result.suggestion = seq.suggestion;
        return result;
      }
    }
  
    // Edge Case 6: Division by zero
    const evaluateExpression = (expr) =>
      Function(`"use strict"; return (${expr})`)();
    if (cleanEquation.includes("/")) {
      const parts = cleanEquation.split("/");
      for (let i = 1; i < parts.length; i++) {
        const divisor = evaluateExpression(parts[i]);
        if (divisor === 0) {
          result.isValid = false;
          result.errorMessage = "Division by zero";
          result.errorIndex = cleanEquation.indexOf(parts[i - 1]) + 1;
          result.suggestion = "Avoid dividing by zero";
          return result;
        }
      }
    }
  
    // Edge Case 7: Decimal Point Validation
    const decimalValidationRegex =
      /(?:^\.|\.$|\.\.|(?:\d+\.\d*\.)|(?:\d*\.\d*\.))/;
    if (decimalValidationRegex.test(cleanEquation)) {
      result.isValid = false;
      result.errorMessage = "Invalid decimal point placement";
      result.suggestion =
        "Ensure decimal points are correctly placed in numbers (no leading/trailing/multiple decimal points)";
      return result;
    }
  
    // Edge Case 8: Unbalanced mathematical structure
    try {
      // Attempt to parse the equation to catch structural issues
      Function(`"use strict"; return (${cleanEquation})`)();
    } catch (error) {
      result.isValid = false;
      result.errorMessage = "Invalid mathematical structure";
      result.suggestion = "Check the overall structure of the equation";
      return result;
    }
  
    return result;
  }
  
  module.exports = { validateEquation };