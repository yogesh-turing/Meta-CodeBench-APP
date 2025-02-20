function processData(input) {
    return input.map(num => {
        // Handle invalid cases
        if (typeof num === 'number' && (!Number.isFinite(num) || Number.isNaN(num))) {
            return 'INVALID';
        }

        // Convert to string, handling BigInt if necessary
        let strNum = num.toString();
        
        // Handle single digit numbers (including negative ones)
        if ((strNum.length === 1) || (strNum.length === 2 && strNum[0] === '-')) {
            return strNum;
        }

        // Process the number
        let isNegative = strNum[0] === '-';
        if (isNegative) {
            strNum = strNum.slice(1);
        }

        if (strNum.includes('.')) {
            // Handle floating point numbers
            let [intPart, decPart] = strNum.split('.');
            
            // Reverse integer part while preserving leading zeros
            let reversedInt = intPart.length > 1 
                ? intPart.split('').reverse().join('')
                : intPart;
            
            // Reverse decimal part
            let reversedDec = decPart.split('').reverse().join('');
            
            strNum = reversedInt + '.' + reversedDec;
        } else {
            // Handle integers while preserving trailing zeros
            let significantDigits = strNum.replace(/^0+/, '');
            let leadingZeros = strNum.length - significantDigits.length;
            
            // Reverse the significant digits
            let reversedSignificant = significantDigits.split('').reverse().join('');
            
            // Add back the zeros at the end
            strNum = reversedSignificant + '0'.repeat(leadingZeros);
        }

        return isNegative ? '-' + strNum : strNum;
    }).join('|');
}

module.exports = { processData };