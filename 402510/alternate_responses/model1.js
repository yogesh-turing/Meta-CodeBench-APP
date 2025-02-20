const { parsePhoneNumber } = require('libphonenumber-js');

function formatPhoneNumber(number) {
    if (!number || typeof number !== 'string') return null;
    
    // Remove whitespace and normalize input
    const cleanNumber = number.trim();
    if (!cleanNumber) return null;

    try {
        // Try parsing with existing country code
        let phoneNumber;
        try {
            phoneNumber = parsePhoneNumber(cleanNumber);
        } catch {
            // If parsing fails, assume US number and add +1
            const withCountryCode = cleanNumber.startsWith('+') 
                ? cleanNumber 
                : `+1${cleanNumber.replace(/\D/g, '')}`;
            phoneNumber = parsePhoneNumber(withCountryCode);
        }

        // Validate the phone number
        if (!phoneNumber || !phoneNumber.isValid()) {
            return null;
        }

        // Return E.164 format
        return phoneNumber.format('E.164');
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
        } catch {
            return null;
        }
    });
}

module.exports = { validatePhoneNumbers };