class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Check if the input string contains non-numeric data
        if (!/^\d+$/.test(numbers)) {
            throw new Error('Input string should only contain numeric data');
        }

        // Convert the input string to an array of digits
        let digits = numbers.split('').map(Number);

        // Initialize the current position to the first digit
        let position = 0;

        // Process each action in the actions string
        for (let action of actions) {
            // Right Arrow: Move to the next digit
            if (action === 'R') {
                position = (position + 1) % digits.length;
            }
            // Left Arrow: Move to the previous digit
            else if (action === 'L') {
                position = (position - 1 + digits.length) % digits.length;
            }
            // Up Arrow: Increment the current digit by one
            else if (action === 'T') {
                digits[position] = Math.min(digits[position] + 1, 9);
            }
            // Down Arrow: Decrement the current digit by one
            else if (action === 'D') {
                digits[position] = Math.max(digits[position] - 1, 0);
            }
            // Swap: Swap the current digit with the digit at the specified position
            else if (action.startsWith('S')) {
                let swapPosition = parseInt(action.substring(1)) - 1;
                [digits[position], digits[swapPosition]] = [digits[swapPosition], digits[position]];
            }
        }

        // Join the digits array back into a string and return
        return digits.join('');
    }
}

module.exports = { DocumentEncryptor };