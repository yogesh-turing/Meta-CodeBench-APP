function processData(input) {
    return input.map(num => {
        // Handle NaN and Infinity cases
        if (Number.isNaN(num) || !Number.isFinite(num)) {
            return "INVALID";
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
            strNum = strNum.slice(1);
        }

        if (strNum.includes('.')) {
            // Handle floating-point numbers
            let [intPart, decPart] = strNum.split('.');
            
            // Reverse integer part if it's more than one digit
            if (intPart.length > 1) {
                intPart = intPart.split('').reverse().join('');
            }
            
            // Always reverse decimal part
            decPart = decPart.split('').reverse().join('');
            
            strNum = intPart + '.' + decPart;
        } else {
            // Handle integer numbers
            strNum = strNum.split('').reverse().join('');
        }

        // Add back the minus sign if number was negative
        return isNegative ? '-' + strNum : strNum;
    }).join('|');
}

module.exports = { processData };