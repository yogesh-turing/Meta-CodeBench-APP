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

  // Define a function to check if a string contains at least one uppercase letter
  const hasUppercase = (str) => /[A-Z]/.test(str);

  // Define a function to check if a string contains at least one lowercase letter
  const hasLowercase = (str) => /[a-z]/.test(str);

  // Define a function to check if a string contains at least one number
  const hasNumber = (str) => /\d/.test(str);

  // Define a function to check if a string contains at least one special character
  const hasSpecial = (str) => /[!@#$%^&*()_+=[${};':"\\|,.<>?]/.test(str);

  // Define a function to check if a string has no consecutive repeating characters
  const hasNoConsecutive = (str) => {
    for (let i = 0; i < str.length - 2; i++) {
      if (str[i] === str[i + 1] && str[i] === str[i + 2]) return false;
    }
    return true;
  };

  // Define a function to check if a string contains common words
  const hasNoCommonWords = (str) => {
    const commonWords = ["password", "123456", "qwerty", "admin"];
    const cleanStr = str
      .toLowerCase()
      .replace(/@/g, "a")
      .replace(/0/g, "o")
      .replace(/1/g, "i");
    return !commonWords.some((word) => cleanStr.includes(word));
  };

  // Define a function to check if a string has no sequential patterns
  const hasNoSequential = (str) => {
    for (let i = 0; i < str.length - 2; i++) {
      if (
        str.charCodeAt(i) === str.charCodeAt(i + 1) - 1 &&
        str.charCodeAt(i + 1) === str.charCodeAt(i + 2) - 1
      )
        return false;
    }
    return true;
  };

  // Define requirements object with all validation functions
  const requirements = {
    length: password.length >= 8 && password.length <= 32,
    uppercase: hasUppercase(password),
    lowercase: hasLowercase(password),
    number: hasNumber(password),
    special: hasSpecial(password),
    noConsecutive: hasNoConsecutive(password),
    noCommonWords: hasNoCommonWords(password),
    noSequential: hasNoSequential(password),
  };

  // Filter requirements to find failed checks
  const failedChecks = Object.entries(requirements)
    .filter(([, passes]) => !passes)
    .map(([check]) => check);

  // If no checks failed, return success message
  if (failedChecks.length === 0) {
    return {
      isValid: true,
      message: "Password meets all security requirements",
      suggestions: [],
    };
  }

  // Define suggestion map for failed checks
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

  // Return failed checks with corresponding suggestions
  return {
    isValid: false,
    message: "Password does not meet all security requirements",
    suggestions: failedChecks.map((check) => suggestionMap[check]),
  };
}

module.exports = { validatePassword };