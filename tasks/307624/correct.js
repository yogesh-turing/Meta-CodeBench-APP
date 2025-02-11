function validateEquation(equation) {
  // Remove all whitespace from the equation
  const cleanEquation = equation.replace(/\s/g, '');
  // Validation result object
  const result = {
    isValid: true,
    errorMessage: '',
    errorIndex: -1,
    suggestion: '',
  };

  // Edge Case 1: Empty equation
  if (cleanEquation.length === 0) {
    result.isValid = false;
    result.errorMessage = 'Empty equation';
    result.suggestion = 'Please enter a valid mathematical expression';
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
      'Remove or replace invalid characters. Only numbers, +, -, *, /, (, and ) are allowed.';

    return result;
  }

  // Edge Case 3: Multiple Invalid Sequences
  const invalidSequences = [
    {
      regex: /([+\-*/]{2,})(?!\s*-?\d)/,
      message: 'Multiple consecutive operators',
      suggestion: 'Remove extra operators or check operator placement',
    },
    {
      regex: /$$/,
      message: 'Empty parentheses',
      suggestion: 'Remove empty parentheses or add a value inside them',
    },
    {
      regex: /^[+*/]/,
      message: 'Equation cannot start with this operator',
      suggestion: 'Start the equation with a number or an opening parentheses',
    },
    {
      regex: /[+\-*/]$/,
      message: 'Equation cannot end with an operator',
      suggestion: 'End the equation with a number or a closing parentheses',
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

  // Edge Case 4: Division by zero
  const evaluateExpression = (expr) =>
    Function(`"use strict"; return (${expr})`)();
  const fixParentheses = (equation) => {
    let unmatchedOpen = 0;
    let unmatchedClose = 0;

    for (const char of equation) {
      if (char === '(') {
        unmatchedOpen++;
      } else if (char === ')') {
        if (unmatchedOpen > 0) {
          unmatchedOpen--;
        } else {
          unmatchedClose++;
        }
      }
    }
    const fixedEquation =
      '('.repeat(unmatchedClose) + equation + ')'.repeat(unmatchedOpen);

    return fixedEquation;
  };
  if (cleanEquation.includes('/')) {
    const parts = cleanEquation.split('/');
    for (let i = 1; i < parts.length; i++) {
      const divisor = evaluateExpression(fixParentheses(parts[i]));
      if (divisor === 0) {
        result.isValid = false;
        result.errorMessage = 'Division by zero';
        result.errorIndex = cleanEquation.indexOf(parts[i - 1]) + 1;
        result.suggestion = 'Avoid dividing by zero';
        return result;
      }
    }
  }

  // Edge Case 5: Decimal Point Validation
  const decimalValidationRegex =
    /(?:^\.|\.$|\.\.|(?:\d+\.\d*\.)|(?:\d*\.\d*\.))/;
  if (decimalValidationRegex.test(cleanEquation)) {
    result.isValid = false;
    result.errorMessage = 'Invalid decimal point placement';
    result.suggestion =
      'Ensure decimal points are correctly placed in numbers (no leading/trailing/multiple decimal points)';
    return result;
  }

  // Edge Case 6: Unbalanced mathematical structure
  try {
    // Attempt to parse the equation to catch structural issues
    Function(`"use strict"; return (${cleanEquation})`)();
  } catch (error) {
    result.isValid = false;
    result.errorMessage = 'Invalid mathematical structure';
    result.suggestion = 'Check the overall structure of the equation';
    return result;
  }

  return result;
}

module.exports = { validateEquation };