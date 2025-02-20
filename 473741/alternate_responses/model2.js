function processData(input) {
    return input.map(num => {
        // Handle invalid cases
        if (!Number.isFinite(num)) {
            return 'INVALID';
        }

        // Handle BigInt if number exceeds safe integer limit
        if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
            try {
                const bigInt = BigInt(num);
                const isNegative = bigInt < 0n;
                const absStr = bigInt.toString().replace('-', '');
                return isNegative ? '-' + absStr.split('').reverse().join('') : absStr.split('').reverse().join('');
            } catch {
                return 'INVALID';
            }
        }

        // Convert to string and handle sign
        let strNum = num.toString();
        const isNegative = strNum.startsWith('-');
        strNum = strNum.replace('-', '');

        // Handle single-digit numbers
        if (strNum.length === 1 || (strNum.length === 3 && strNum.includes('.'))) {
            return isNegative ? '-' + strNum : strNum;
        }

        if (strNum.includes('.')) {
            // Handle floating-point numbers
            let [intPart, decPart] = strNum.split('.');
            
            // Reverse integer part while preserving leading zeros
            const reversedInt = intPart.split('')
                                     .reverse()
                                     .join('');
            
            // Reverse decimal part
            const reversedDec = decPart.split('')
                                      .reverse()
                                      .join('');

            return isNegative ? 
                   '-' + reversedInt + '.' + reversedDec :
                   reversedInt + '.' + reversedDec;
        } else {
            // Handle integers while preserving trailing zeros
            const reversed = strNum.split('')
                                 .reverse()
                                 .join('');
            return isNegative ? '-' + reversed : reversed;
        }
    }).join('|');
}

module.exports = { processData };