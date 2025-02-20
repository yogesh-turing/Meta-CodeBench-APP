function formatPhoneNumber(number) {
    if (typeof number !== 'string') return null;
    
    const digits = number.replace(/\D/g, '');
    if (digits.length !== 10) return null;

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Function to validate an array of phone numbers
function validatePhoneNumbers(phoneNumbers) {
    return phoneNumbers.map(num => formatPhoneNumber(num));
}

module.exports = { validatePhoneNumbers };