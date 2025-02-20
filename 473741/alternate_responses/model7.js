function processData(input) {
    return input.map(num => {
        // Check for NaN, Infinity, or -Infinity
        if (Number.isNaN(num) || !Number.isFinite(num)) {
            return "INVALID";
        }

        let strNum = num.toString();

        // Check for negative numbers
        let isNegative = false;
        if (num < 0) {
            isNegative = true;
            strNum = strNum.slice(1);
        }

        // Check for floats
        let isFloat = false;
        if (strNum.includes('.')) {
            isFloat = true;
            let parts = strNum.split('.');
            strNum = parts[0].split('').reverse().join('') + '.' + parts[1].split('').reverse().join('');
        } else {
            // Reverse the string
            strNum = strNum.split('').reverse().join('');
        }

        // Add the negative sign back if necessary
        if (isNegative) {
            strNum = '-' + strNum;
        }

        // Check for numbers exceeding JavaScript's safe integer limit
        if (num > Number.MAX_SAFE_INTEGER) {
            strNum = BigInt(strNum);
        }

        return strNum;
    }).join('|');
}

module.exports = processData;