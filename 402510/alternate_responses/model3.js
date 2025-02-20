const { parsePhoneNumber } = require('libphonenumber-js');

function formatPhoneNumber(number) {
    if (!number || typeof number !== 'string') {
        return null;
    }

    // Remove whitespace and normalize input
    const cleanNumber = number.trim();
    
    try {
        // Try parsing with explicit country code if provided
        if (cleanNumber.startsWith('+')) {
            const phoneNumber = parsePhoneNumber(cleanNumber);
            return phoneNumber.isValid() ? phoneNumber.format('E.164') : null;
        }

        // For numbers without country code, assume US (+1)
        // Remove all non-digit characters
        const digitsOnly = cleanNumber.replace(/\D/g, '');
        
        // Handle US numbers (with or without leading 1)
        const normalizedNumber = digitsOnly.length === 11 && digitsOnly.startsWith('1') 
            ? digitsOnly 
            : digitsOnly.length === 10 
                ? '1' + digitsOnly 
                : null;

        if (!normalizedNumber) {
            return null;
        }

        const phoneNumber = parsePhoneNumber('+' + normalizedNumber);
        return phoneNumber.isValid() ? phoneNumber.format('E.164') : null;

    } catch (error) {
        return null;
    }
}

function validatePhoneNumbers(phoneNumbers) {
    if (!Array.isArray(phoneNumbers)) {
        return [];
    }
    
    return phoneNumbers.map(number => {
        try {
            return formatPhoneNumber(number);
        } catch (error) {
            return null;
        }
    });
}

module.exports = { validatePhoneNumbers };