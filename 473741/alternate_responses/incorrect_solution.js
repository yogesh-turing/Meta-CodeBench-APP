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

        // Split into parts if it's a decimal number
        if (strNum.includes('.')) {
            let [intPart, decPart] = strNum.split('.');
            let isNegative = intPart.startsWith('-');
            
            // Remove minus sign for processing
            if (isNegative) {
                intPart = intPart.slice(1);
            }

            // Handle single-digit integer part
            if (intPart.length === 1) {
                return (isNegative ? '-' : '') + intPart + '.' + 
                       decPart.split('').reverse().join('');
            }

            // Reverse both parts separately
            let reversedInt = intPart.split('').reverse().join('');
            let reversedDec = decPart.split('').reverse().join('');
            
            return (isNegative ? '-' : '') + reversedInt + '.' + reversedDec;
        }
        
        // Handle non-decimal numbers
        let isNegative = strNum.startsWith('-');
        if (isNegative) {
            strNum = strNum.slice(1);
        }
        
        // Reverse the digits while preserving trailing zeros
        let reversed = strNum.split('').reverse().join('');
        
        return (isNegative ? '-' : '') + reversed;
    }).join('|');
}

module.exports = { processData };