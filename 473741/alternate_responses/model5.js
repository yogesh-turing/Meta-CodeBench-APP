function processData(input) {
    return input.map(num => {
        // Handle invalid cases
        if (typeof num === 'number' && !Number.isFinite(num)) {
            return 'INVALID';
        }

        // Convert to string, handling BigInt if necessary
        let strNum = num.toString();
        
        // Handle single-digit numbers (including negative ones)
        if ((strNum.length === 1) || (strNum.length === 2 && strNum[0] === '-')) {
            return strNum;
        }

        const isNegative = strNum[0] === '-';
        // Remove minus sign for processing
        if (isNegative) {
            strNum = strNum.substring(1);
        }

        if (strNum.includes('.')) {
            // Handle floating-point numbers
            let [intPart, decPart] = strNum.split('.');
            
            // If integer part is single digit, only reverse decimal part
            if (intPart.length === 1) {
                const reversedDecPart = decPart.split('').reverse().join('');
                return (isNegative ? '-' : '') + intPart + '.' + reversedDecPart;
            }
            
            // Reverse both parts separately
            const reversedIntPart = intPart.split('').reverse().join('');
            const reversedDecPart = decPart.split('').reverse().join('');
            return (isNegative ? '-' : '') + reversedIntPart + '.' + reversedDecPart;
        } else {
            // Handle integers
            // Preserve trailing zeros by padding the reversed string
            const reversedNum = strNum.split('').reverse().join('');
            return (isNegative ? '-' : '') + reversedNum;
        }
    }).join('|');
}

module.exports = { processData };