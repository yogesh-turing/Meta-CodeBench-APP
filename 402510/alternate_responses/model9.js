const { parsePhoneNumber } = require('libphonenumber-js');

function formatPhoneNumber(number) {
    if (typeof number !== 'string') return null;
    
    const parsedNumber = parsePhoneNumber(number);
    if (!parsedNumber || !parsedNumber.isValid()) return null;

    return parsedNumber.number;
}

// Function to validate an array of phone numbers
function validatePhoneNumbers(phoneNumbers) {
    return phoneNumbers.map(num => formatPhoneNumber(num));
}

module.exports = { validatePhoneNumbers };