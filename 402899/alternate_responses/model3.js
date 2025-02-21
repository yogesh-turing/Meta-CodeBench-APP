class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Input validation
        if (!numbers || !numbers.trim()) {
            throw new IllegalArgumentException("Input string cannot be empty");
        }
        
        if (!/^-?\d+$/.test(numbers)) {
            throw new IllegalArgumentException("Input must contain only numbers");
        }
        
        if (!actions) {
            return numbers;
        }

        // Convert negative numbers to 0
        let numArray = numbers.split('').map(char => 
            char === '-' ? '0' : char
        );
        
        let currentPos = 0;
        let i = 0;
        
        while (i < actions.length) {
            const action = actions[i];
            
            switch(action) {
                case 'R':
                    currentPos = Math.min(currentPos + 1, numArray.length - 1);
                    i++;
                    break;
                    
                case 'L':
                    currentPos = Math.max(currentPos - 1, 0);
                    i++;
                    break;
                    
                case 'T':
                    if (numArray[currentPos] !== '9') {
                        numArray[currentPos] = String(parseInt(numArray[currentPos]) + 1);
                    }
                    i++;
                    break;
                    
                case 'D':
                    if (numArray[currentPos] !== '0') {
                        numArray[currentPos] = String(parseInt(numArray[currentPos]) - 1);
                    }
                    i++;
                    break;
                    
                case 'S':
                    if (i + 1 < actions.length) {
                        const swapPos = parseInt(actions[i + 1]);
                        if (!isNaN(swapPos) && swapPos <= numArray.length) {
                            // Perform swap
                            const temp = numArray[currentPos];
                            numArray[currentPos] = numArray[swapPos - 1];
                            numArray[swapPos - 1] = temp;
                            i += 2;
                        } else {
                            i++;
                        }
                    } else {
                        i++;
                    }
                    break;
                    
                default:
                    i++;
            }
        }
        
        return numArray.join('');
    }
}

module.exports = { DocumentEncryptor };