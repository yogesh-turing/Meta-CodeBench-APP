function processData(input) {
    return input.map(num => {
        // Check if input is NaN, Infinity, or -Infinity
        if (isNaN(num) || !isFinite(num)) {
            return "INVALID";
        }

        // Check if input is a BigInt
        if (typeof num === 'bigint') {
            num = num.toString();
        }

        // Convert number to string
        let strNum = num.toString();

        // Check if number is negative
        let isNegative = false;
        if (strNum.startsWith('-')) {
            isNegative = true;
            strNum = strNum.slice(1);
        }

        // Check if number is a float
        if (strNum.includes('.')) {
            let parts = strNum.split('.');
            let integerPart = parts[0];
            let decimalPart = parts[1];

            // Reverse integer and decimal parts separately
            integerPart = integerPart.split('').reverse().join('');
            decimalPart = decimalPart.split('').reverse().join('');

            // Combine reversed parts
            strNum = integerPart + '.' + decimalPart;
        } else {
            // Reverse the integer
            strNum = strNum.split('').reverse().join('');
        }

        // Add back the negative sign if necessary
        if (isNegative) {
            strNum = '-' + strNum;
        }

        return strNum;
    }).join('|');
}

module.exports = processData;