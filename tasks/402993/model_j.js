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

  // Map of common words and their variations
  const commonWords = {
    password: ["p@ssw0rd", "p@ssword", "passw0rd"],
    admin: ["@dmin", "4dmin"],
    qwerty: ["qw3rty", "qwert7"],
    "123456": ["12345$", "1234$6"],
  };

  // List of sequential patterns
  const sequentialPatterns = ["abc", "123", "xyz"];

  // Requirements for a strong password
  const requirements = {
    length: password.length >= 8 && password.length <= 32,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=${};':"\\|,.<>?]/.test(password),
    noConsecutive: !/(.)\1{2,}/.test(password), // Check for consecutive repeating characters
    noCommonWords: !Object.keys(commonWords).some((word) => {
      // Check if password contains common word or its variations
      return commonWords[word].some((variation) => {
        return password.toLowerCase().includes(variation.toLowerCase());
      });
    }),
    noSequential: !sequentialPatterns.some((pattern) => {
      // Check if password contains sequential patterns
      return password.toLowerCase().includes(pattern.toLowerCase());
    }),
  };

  const failedChecks = Object.entries(requirements)
    .filter(([, passes]) => !passes)
    .map(([check]) => check);

  if (failedChecks.length === 0) {
    return {
      isValid: true,
      message: "Password meets all security requirements",
      suggestions: [],
    };
  }

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

  return {
    isValid: false,
    message: `Password failed ${failedChecks.length} security checks`,
    suggestions: failedChecks.map((check) => suggestionMap[check]),
  };
}

module.exports = { validatePassword };