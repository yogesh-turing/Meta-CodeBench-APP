function processData(input) {
    return input.map(num => {
        // Check if the number is NaN, Infinity, or -Infinity
        if (isNaN(num) || !isFinite(num)) {
            return 'INVALID';
        }

        // Convert the number to a string
        let strNum = num.toString();

        // Check if the number is negative
        let isNegative = false;
        if (strNum.startsWith('-')) {
            isNegative = true;
            strNum = strNum.slice(1);
        }

        // Check if the number is a float
        let isFloat = false;
        if (strNum.includes('.')) {
            isFloat = true;
            let parts = strNum.split('.');
            // Reverse the integer and decimal parts separately
            let reversedInt = parts[0].split('').reverse().join('');
            let reversedDec = parts[1].split('').reverse().join('');
            strNum = reversedInt + '.' + reversedDec;
        } else {
            // Reverse the integer
            strNum = strNum.split('').reverse().join('');
        }

        // Add the minus sign back if the number was negative
        if (isNegative) {
            strNum = '-' + strNum;
        }

        // Check if the number exceeds the safe integer limit
        if (num > Number.MAX_SAFE_INTEGER) {
            // Convert the number to a BigInt
            num = BigInt(num);
        }

        return strNum;
    }).join('|');
}

module.exports = processData;