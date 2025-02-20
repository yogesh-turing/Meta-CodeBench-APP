const { parsePhoneNumberFromString } = require('libphonenumber-js');

/**
 * Validates and formats an array of phone numbers.
 * @param {string[]} phoneNumbers - Array of phone number strings.
 * @param {string} defaultCountry - The default country code (e.g., 'US') for numbers without a country code.
 * @returns {(string|null)[]} - Array of formatted phone numbers in E.164 format or null for invalid numbers.
 * @throws {TypeError} - If the input is not an array.
 */
function validatePhoneNumbers(phoneNumbers, defaultCountry = 'US') {
  if (!Array.isArray(phoneNumbers)) {
    throw new TypeError('Input must be an array');
  }

  return phoneNumbers.map((number) => {
    if (typeof number !== 'string') {
      return null;
    }

    try {
      // First, try to parse as is
      let phoneNumber = parsePhoneNumberFromString(number, defaultCountry);

      // If parsing fails and number doesn't start with +, try adding the country code
      if (!phoneNumber && !number.trim().startsWith('+')) {
        // For US numbers, ensure they have 10 digits
        const digits = number.replace(/\D/g, '');
        if (defaultCountry === 'US' && digits.length === 10) {
          phoneNumber = parsePhoneNumberFromString(
            '1' + digits,
            defaultCountry
          );
        }
      }

      // Return formatted number if valid
      if (phoneNumber && phoneNumber.isValid()) {
        return phoneNumber.format('E.164');
      }

      return null;
    } catch (error) {
      return null;
    }
  });
}

module.exports = { validatePhoneNumbers };