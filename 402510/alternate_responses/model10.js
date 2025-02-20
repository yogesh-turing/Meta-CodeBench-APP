const { parsePhoneNumber } = require('libphonenumber-js');

function formatPhoneNumber(number) {
    if (typeof number !== 'string') return null;
    
    const digits = number.replace(/\D/g, '');
    if (digits.length < 10) return null;

    const parsedNumber = parsePhoneNumber(`+${digits}`);
    if (!parsedNumber || !parsedNumber.isValid()) return null;

    return parsedNumber.format('E.164');
}

// Function to validate an array of phone numbers
function validatePhoneNumbers(phoneNumbers) {
    return phoneNumbers.map(num => formatPhoneNumber(num));
}

module.exports = { validatePhoneNumbers };