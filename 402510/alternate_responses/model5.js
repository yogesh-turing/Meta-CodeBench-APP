const { parsePhoneNumber, isValidPhoneNumber } = require('libphonenumber-js');

function formatPhoneNumber(number) {
    // Handle invalid inputs
    if (!number || typeof number !== 'string') {
        return null;
    }

    // Remove whitespace and normalize input
    const cleanNumber = number.trim();
    
    try {
        // First attempt: Try parsing with explicit country code
        if (cleanNumber.startsWith('+')) {
            if (!isValidPhoneNumber(cleanNumber)) {
                return null;
            }
            const phoneNumber = parsePhoneNumber(cleanNumber);
            return phoneNumber.format('E.164');
        }

        // Second attempt: Assume North American number if no country code
        const normalizedNumber = cleanNumber.replace(/[-.()\s]/g, '');
        
        // Handle North American numbers (default to +1)
        if (normalizedNumber.length === 10) {
            const numberWithCountry = `+1${normalizedNumber}`;
            if (!isValidPhoneNumber(numberWithCountry)) {
                return null;
            }
            const phoneNumber = parsePhoneNumber(numberWithCountry);
            return phoneNumber.format('E.164');
        }

        // Third attempt: Try parsing with whatever format is provided
        if (isValidPhoneNumber(cleanNumber)) {
            const phoneNumber = parsePhoneNumber(cleanNumber);
            return phoneNumber.format('E.164');
        }

        return null;
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