const libphonenumber = require('libphonenumber-js');

function formatPhoneNumber(number) {
    if (typeof number !== 'string') return null;
    
    const digits = number.replace(/\D/g, '');
    if (digits.length < 10) return null;

    try {
        const parsedNumber = libphonenumber.parseNumber(digits);
        if (!parsedNumber) return null;

        const formattedNumber = libphonenumber.formatNumber(parsedNumber, 'E.164');
        return formattedNumber;
    } catch (error) {
        return null;
    }
}

function validatePhoneNumbers(phoneNumbers) {
    return phoneNumbers.map(num => formatPhoneNumber(num));
}

module.exports = { validatePhoneNumbers };