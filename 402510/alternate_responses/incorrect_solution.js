const libphonenumber = require('libphonenumber-js');

function formatPhoneNumber(number) {
    if (typeof number !== 'string') return null;
    if (!number) return null;

    const parsedNumber = libphonenumber.parsePhoneNumber(number);
    if (!parsedNumber.isValid()) return null;

    return libphonenumber.formatNumber(parsedNumber, 'E.164');
}

function validatePhoneNumbers(phoneNumbers) {
    return phoneNumbers.map(num => formatPhoneNumber(num));
}

module.exports = { validatePhoneNumbers };