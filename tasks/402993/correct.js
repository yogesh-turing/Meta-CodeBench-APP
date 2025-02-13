/**
 * Validates if a password meets the security criteria and suggests improvements
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result and suggestions
 */
function validatePassword(password) {
  if (typeof password !== "string") {
    return {
      isValid: false,
      message: "Password must be a string",
      suggestions: ["Please provide a valid string input"],
    };
  }

  // Define the requirements
  const requirements = {
    length: password.length >= 8 && password.length <= 32,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+=[${};':"\\|,.<>/?]/.test(password),
    noConsecutive: !/(.)\1\1/.test(password),
    noCommonWords: ![
      "password",
      "123456",
      "qwerty",
      "admin",
      "abc",
      "123",
      "xyz",
    ].some((word) => {
      const normalizedPassword = password
        .toLowerCase()
        .replace(/a@/g, "a")
        .replace(/0o/g, "o");
      return normalizedPassword.includes(word);
    }),
    noSequential: !/(abc|123|xyz)/i.test(password),
  };

  // Check which requirements failed
  const failedChecks = Object.entries(requirements)
    .filter(([, passes]) => !passes)
    .map(([check]) => check);

  // If all checks pass, return success
  if (failedChecks.length === 0) {
    return {
      isValid: true,
      message: "Password meets all security requirements",
      suggestions: [],
    };
  }

  // Map failed checks to suggestions
  const suggestionMap = {
    length: "Password must be between 8 and 32 characters",
    uppercase: "Include at least one uppercase letter",
    lowercase: "Include at least one lowercase letter",
    number: "Include at least one number",
    special: "Include at least one special character",
    noConsecutive: "Avoid repeating the same character more than twice",
    noCommonWords:
      'Avoid common words like "password", "123456", "qwerty", or "admin"',
    noSequential: 'Avoid sequential patterns like "abc", "123", or "xyz"',
  };

  // Return failed checks and suggestions
  return {
    isValid: false,
    message: "Password does not meet all security requirements",
    suggestions: failedChecks.map((check) => suggestionMap[check]),
  };
}

module.exports = validatePassword;
