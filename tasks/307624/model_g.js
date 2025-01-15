function validateEquation(equation) {
  // Remove all whitespace from the equation
  const cleanEquation = equation.replace(/\s/g, '');

  // Check if the equation is empty
  if (cleanEquation.length === 0) {
      return {
          isValid: false,
          errorMessage: 'Equation is empty.',
          errorIndex: 0,
          suggestion: 'Enter a valid mathematical equation.'
      };
  }

  // Regular expression to validate the equation structure
  const validEquationRegex = /^[0-9+\-*/().]+$/;

  // Check if the equation contains only valid characters
  if (!validEquationRegex.test(cleanEquation)) {
      const invalidCharIndex = cleanEquation.search(/[^0-9+\-*/().]/);
      return {
          isValid: false,
          errorMessage: `Invalid character '${cleanEquation[invalidCharIndex]}' found.`,
          errorIndex: invalidCharIndex,
          suggestion: 'Remove or replace the invalid character with a valid one.'
      };
  }

  // Check for balanced parentheses
  let parenthesesCount = 0;
  let unbalancedParenthesesIndex = -1;
  for (let i = 0; i < cleanEquation.length; i++) {
      const char = cleanEquation[i];
      if (char === '(') {
          parenthesesCount++;
      } else if (char === ')') {
          parenthesesCount--;
      }

      // If at any point we have more closing than opening parentheses, it's invalid
      if (parenthesesCount < 0) {
          unbalancedParenthesesIndex = i;
          break;
      }
  }

  if (unbalancedParenthesesIndex !== -1) {
      return {
          isValid: false,
          errorMessage: 'Unbalanced parentheses found.',
          errorIndex: unbalancedParenthesesIndex,
          suggestion: 'Ensure every opening parenthesis has a corresponding closing parenthesis.'
      };
  }

  // Ensure parentheses are balanced at the end
  if (parenthesesCount !== 0) {
      return {
          isValid: false,
          errorMessage: 'Unbalanced parentheses found.',
          errorIndex: cleanEquation.lastIndexOf('('),
          suggestion: 'Ensure every opening parenthesis has a corresponding closing parenthesis.'
      };
  }

  // Check for invalid sequences of operators
  const invalidOperatorSequences = [
      {
          regex: /[+\-/]{2,}/,
          errorMessage: 'Consecutive operators found.',
          suggestion: 'Separate operators with numbers or parentheses.'
      },
      {
          regex: /\(\)/,
          errorMessage: 'Empty parentheses found.',
          suggestion: 'Remove empty parentheses or add content inside them.'
      },
      {
          regex: /^[+/]/,
          errorMessage: 'Equation starts with an invalid operator.',
          suggestion: 'Start the equation with a number, minus sign, or opening parenthesis.'
      },
      {
          regex: /[+\-*/]$/,
          errorMessage: 'Equation ends with an operator.',
          suggestion: 'End the equation with a number or closing parenthesis.'
      },
  ];

  for (let { regex, errorMessage, suggestion } of invalidOperatorSequences) {
      const match = cleanEquation.match(regex);
      if (match) {
          return {
              isValid: false,
              errorMessage,
              errorIndex: match.index,
              suggestion
          };
      }
  }

  // Check for division by zero
  if (cleanEquation.includes('/0')) {
      return {
          isValid: false,
          errorMessage: 'Division by zero is undefined.',
          errorIndex: cleanEquation.indexOf('/0'),
          suggestion: 'Change the divisor to a non-zero value.'
      };
  }

  // Check for decimal point usage
  if (cleanEquation.includes('.')) {
      const decimalPointIndex = cleanEquation.indexOf('.');
      if (decimalPointIndex === 0 || decimalPointIndex === cleanEquation.length - 1) {
          return {
              isValid: false,
              errorMessage: 'Misplaced decimal point found.',
              errorIndex: decimalPointIndex,
              suggestion: 'Place the decimal point between digits.'
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