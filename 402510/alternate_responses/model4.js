const { parsePhoneNumber } = require('libphonenumber-js');

function formatPhoneNumber(number) {
    if (!number || typeof number !== 'string') {
        return null;
    }

    try {
        // Clean the input string
        const cleanNumber = number.trim();
        
        // Try to parse the number
        let phoneNumber;
        
        // If the number doesn't start with +, assume it's a US number
        if (!cleanNumber.startsWith('+')) {
            phoneNumber = parsePhoneNumber(cleanNumber, 'US');
        } else {
            phoneNumber = parsePhoneNumber(cleanNumber);
        }

        // Check if the number is valid
        if (!phoneNumber || !phoneNumber.isValid()) {
            return null;
        }

        // Return the E.164 format
        return phoneNumber.format('E.164');
    } catch (error) {
        return null;
    }
}

function validatePhoneNumbers(phoneNumbers) {
    if (!Array.isArray(phoneNumbers)) {
        return [];
    }

    return phoneNumbers.map(number => formatPhoneNumber(number));
}

module.exports = { validatePhoneNumbers };