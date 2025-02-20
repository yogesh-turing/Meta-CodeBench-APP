function processData(input) {
    return input.map(num => {
        // Check for NaN, Infinity, and -Infinity
        if (Number.isNaN(num) || !Number.isFinite(num)) {
            return 'INVALID';
        }

        // Convert to string
        let strNum = num.toString();

        // Check for negative numbers
        let isNegative = false;
        if (strNum.startsWith('-')) {
            isNegative = true;
            strNum = strNum.substring(1);
        }

        // Check for floats
        let isFloat = false;
        if (strNum.includes('.')) {
            isFloat = true;
        }

        // Reverse the string
        if (isFloat) {
            let parts = strNum.split('.');
            let reversedInt = parts[0].split('').reverse().join('');
            let reversedDec = parts[1].split('').reverse().join('');
            strNum = reversedInt + '.' + reversedDec;
        } else {
            strNum = strNum.split('').reverse().join('');
        }

        // Add back the negative sign if necessary
        if (isNegative) {
            strNum = '-' + strNum;
        }

        // Check for numbers exceeding safe integer limit
        if (num > Number.MAX_SAFE_INTEGER) {
            strNum = BigInt(num).toString();
        }

        return strNum;
    }).join('|');
}

module.exports = processData;