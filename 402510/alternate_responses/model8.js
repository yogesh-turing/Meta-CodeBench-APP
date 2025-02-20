const { parsePhoneNumber } = require('libphonenumber-js');

function formatPhoneNumber(number) {
    if (typeof number !== 'string') return null;
    number = number.trim(); // Remove leading/trailing spaces
    const parsedNumber = parsePhoneNumber(number);
    if (!parsedNumber || !parsedNumber.isValid()) return null;
    return parsedNumber.formatInternational();
}

function validatePhoneNumbers(phoneNumbers) {
    return phoneNumbers.map(num => formatPhoneNumber(num));
}

module.exports = { validatePhoneNumbers };