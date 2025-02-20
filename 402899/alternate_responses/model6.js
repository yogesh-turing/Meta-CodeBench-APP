class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        let position = 0;
        let numbersArray = numbers.split('').map(Number);

        for (let action of actions) {
            if (action === 'R' && position < numbersArray.length - 1) {
                position++;
            } else if (action === 'L' && position > 0) {
                position--;
            } else if (action === 'T' && numbersArray[position] < 9) {
                numbersArray[position]++;
            } else if (action === 'D' && numbersArray[position] > 0) {
                numbersArray[position]--;
            } else if (action.startsWith('S')) {
                let swapPosition = parseInt(action.substring(1)) - 1;
                if (swapPosition >= 0 && swapPosition < numbersArray.length) {
                    [numbersArray[position], numbersArray[swapPosition]] = [numbersArray[swapPosition], numbersArray[position]];
                }
            }
        }

        return numbersArray.join('');
    }
}

module.exports = {DocumentEncryptor};