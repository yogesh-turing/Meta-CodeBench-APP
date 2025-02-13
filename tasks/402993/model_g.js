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

  // Define the requirements object with all the necessary checks
  const requirements = {
    length: password.length >= 8 && password.length <= 32,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    noConsecutive: !/(.)\1\1/.test(password),
    noCommonWords: !isCommonWord(password),
    noSequential: !isSequential(password),
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

  const suggestions = failedChecks.map((check) => suggestionMap[check]);

  return {
    isValid: false,
    message: "Password does not meet all security requirements",
    suggestions,
  };
}

// Helper function to check if a password contains a common word
function isCommonWord(password) {
  const commonWords = ["password", "123456", "qwerty", "admin"];
  const passwordLower = password.toLowerCase().replace(/@/g, "a").replace(/0/g, "o");
  return commonWords.some((word) => passwordLower.includes(word));
}

// Helper function to check if a password contains a sequential pattern
function isSequential(password) {
  const sequences = ["abc", "123", "xyz"];
  const passwordLower = password.toLowerCase();
  return sequences.some((sequence) => passwordLower.includes(sequence));
}

module.exports = { validatePassword };