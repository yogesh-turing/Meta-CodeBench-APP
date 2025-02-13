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

  // Normalize password for common word check
  const normalizedPassword = password
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[0o]/g, 'o')
    .replace(/[1!i]/g, 'i')
    .replace(/[$s]/g, 's')
    .replace(/[3e]/g, 'e');

  const commonWords = ['password', '123456', 'qwerty', 'admin'];
  
  const requirements = {
    length: password.length >= 8 && password.length <= 32,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=$${};:'",.<>/?\\|]/.test(password),
    noConsecutive: !/(.)\1{2,}/.test(password),
    noCommonWords: !commonWords.some(word => normalizedPassword.includes(word)),
    noSequential: !(
      /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/i
      .test(password)
    )
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
    message: "Password does not meet security requirements",
    suggestions: failedChecks.map(check => suggestionMap[check])
  };
}

module.exports = { validatePassword };