const { parsePhoneNumber, isValidPhoneNumber } = require('libphonenumber-js');

function formatPhoneNumber(number) {
    // Handle invalid inputs
    if (!number || typeof number !== 'string') {
        return null;
    }

    try {
        // Clean the input string
        const cleanNumber = number.trim();
        
        // Try to parse the phone number
        // If no country code is provided, assume US (+1)
        let phoneNumber;
        try {
            phoneNumber = parsePhoneNumber(cleanNumber, 'US');
        } catch (e) {
            // If parsing fails with US, try without default country
            try {
                phoneNumber = parsePhoneNumber(cleanNumber);
            } catch (e) {
                return null;
            }
        }

        // Check if the parsed number is valid
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
    // Handle invalid input array
    if (!Array.isArray(phoneNumbers)) {
        return [];
    }

    // Process each phone number
    return phoneNumbers.map(number => {
        try {
            return formatPhoneNumber(number);
        } catch (error) {
            return null;
        }
    });
}

module.exports = { validatePhoneNumbers };