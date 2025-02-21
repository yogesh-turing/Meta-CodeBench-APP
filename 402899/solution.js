class DocumentEncryptor {
    /**
     * This method encrypts the input number string based on the actions provided in the 
     * actions string. Each action in the string corresponds to a specific operation on 
     * the number string, such as moving a cursor position, incrementing or decrementing 
     * the number at the cursor position, or swapping values in the number string.
     * 
     * Valid actions include:
     * - 'R' - Move the cursor to the right, if possible
     * - 'L' - Move the cursor to the left, if possible
     * - 'T' - Increment the digit at the cursor position, if it is not 9
     * - 'D' - Decrement the digit at the cursor position, if it is not 0
     * - 'S' - Swap the number at the cursor position with the number at a position 
     *   indicated by the following character in the action string
     * 
     * The method will return a new string with the modified numbers.
     * 
     * @param {string} numbers - A string representing the numbers to be encrypted. Only numeric characters 
     *                            should be included.
     * @param {string} actions - A string representing the actions to be performed on the numbers.
     *                            Each character in the actions string denotes a specific action (R, L, T, D, S).
     * @returns {string} - A string with the numbers encrypted based on the actions.
     * @throws {Error} - If the input number string contains non-numeric characters.
     */
    encryptNumbers(numbers, actions) {
        if (!numbers || numbers.length === 0 || !actions || actions.length === 0) {
            return numbers;
        }

        // Replace negative digits by 0
        numbers = numbers.replace(/-\d/g, '0');

        // Validation to ensure the number string only consists of numeric characters
        if (!/^\d+$/.test(numbers)) {
            throw new Error('Input string must contain only numeric characters');
        }

        // Convert input string to array for easier manipulation
        let nums = numbers.split('');

        let currentPos = 0;

        // Process each action
        for (let i = 0; i < actions.length; i++) {
            let action = actions.charAt(i);

            // Skip if we're already at the end of numbers
            if (currentPos >= nums.length) {
                break;
            }

            switch (action) {
                case 'R':
                    // Move right if possible
                    if (currentPos < nums.length - 1) {
                        currentPos++;
                    }
                    break;

                case 'L':
                    // Move left if possible
                    if (currentPos > 0) {
                        currentPos--;
                    }
                    break;

                case 'T':
                    // Increment current number if not 9
                    if (nums[currentPos] < '9') {
                        nums[currentPos] = (parseInt(nums[currentPos]) + 1).toString();
                    }
                    break;

                case 'D':
                    // Decrement current number if not 0
                    if (nums[currentPos] > '0') {
                        nums[currentPos] = (parseInt(nums[currentPos]) - 1).toString();
                    }
                    break;

                case 'S':
                    // Handle swap operation
                    if (i + 1 < actions.length) {
                        try {
                            let n = parseInt(actions.charAt(i + 1));
                            if (n > 0 && n <= nums.length) {
                                // Perform swap
                                let temp = nums[currentPos];
                                nums[currentPos] = nums[n - 1];
                                nums[n - 1] = temp;
                            }
                            i++; // Skip the next character as it's part of swap command
                        } catch (e) {
                            // Invalid swap position, ignore
                        }
                    }
                    break;

                default:
                    // Invalid character in action string
                    break;
            }
        }

        return nums.join('');
    }
}

module.exports = {DocumentEncryptor};