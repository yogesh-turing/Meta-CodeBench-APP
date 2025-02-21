class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Check if input string contains numeric data
        if (!/^\d+$/.test(numbers)) {
            throw new Error('Input string should contain only numeric data');
        }

        // Initialize the result array with the input numbers
        let result = numbers.split('').map(Number);

        // Initialize the current position
        let position = 0;

        // Iterate over each action in the actions string
        for (let i = 0; i < actions.length; i++) {
            // Get the current action
            let action = actions[i];

            // Perform the action
            switch (action) {
                case 'R':
                    // Move to the next character
                    position = Math.min(position + 1, result.length - 1);
                    break;
                case 'L':
                    // Move to the previous character
                    position = Math.max(position - 1, 0);
                    break;
                case 'T':
                    // Increment the digit by one
                    result[position] = Math.min(result[position] + 1, 9);
                    break;
                case 'D':
                    // Decrement the digit by one
                    result[position] = Math.max(result[position] - 1, 0);
                    break;
                case 'S':
                    // Swap the current position with the number in the nth position
                    let n = parseInt(actions[++i]);
                    let temp = result[position];
                    result[position] = result[n - 1];
                    result[n - 1] = temp;
                    break;
            }
        }

        // Return the transformed numbers as a string
        return result.join('');
    }
}

module.exports = {DocumentEncryptor};