class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Validate input
        if (!numbers || !actions) {
            throw new Error("Invalid input");
        }

        // Convert numbers string to an array for easier manipulation
        let numbersArray = numbers.split('').map(Number);

        // Initialize position
        let position = 0;

        // Process actions
        for (let action of actions) {
            // Right Arrow
            if (action === 'R') {
                position = Math.min(position + 1, numbersArray.length - 1);
            }
            // Left Arrow
            else if (action === 'L') {
                position = Math.max(position - 1, 0);
            }
            // Up Arrow
            else if (action === 'T') {
                numbersArray[position] = Math.min(numbersArray[position] + 1, 9);
            }
            // Down Arrow
            else if (action === 'D') {
                numbersArray[position] = Math.max(numbersArray[position] - 1, 0);
            }
            // Swap
            else if (action.startsWith('S')) {
                let swapPosition = parseInt(action.substring(1)) - 1;
                if (swapPosition >= 0 && swapPosition < numbersArray.length) {
                    [numbersArray[position], numbersArray[swapPosition]] = [numbersArray[swapPosition], numbersArray[position]];
                }
            }
        }

        // Convert array back to string and return
        return numbersArray.join('');
    }
}

module.exports = {DocumentEncryptor};