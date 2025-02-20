function processData(input) {
    return input.map(num => {
        // Check if input is NaN, Infinity, or -Infinity
        if (Number.isNaN(num) || !Number.isFinite(num)) {
            return "INVALID";
        }

        // Check if input is a float
        if (num % 1 !== 0) {
            // Split integer and decimal parts
            let parts = num.toString().split('.');
            // Reverse the integer and decimal parts separately
            let reversedIntegerPart = parts[0].split('').reverse().join('');
            let reversedDecimalPart = parts[1].split('').reverse().join('');
            // Combine the reversed integer and decimal parts
            let reversedNum = reversedIntegerPart + '.' + reversedDecimalPart;
            // Check if the input is negative
            if (num < 0) {
                reversedNum = '-' + reversedNum;
            }
            return reversedNum;
        } else {
            // Check if input is a negative integer
            if (num < 0) {
                // Remove the minus sign, reverse the number, and add the minus sign back
                let reversedNum = '-' + num.toString().slice(1).split('').reverse().join('');
                return reversedNum;
            } else {
                // Reverse the number
                let reversedNum = num.toString().split('').reverse().join('');
                return reversedNum;
            }
        }
    }).join('|');
}

module.exports = processData;