class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Input validation
        if (!numbers || !numbers.match(/^-?\d+$/)) {
            throw new IllegalArgumentException("Input must contain only numbers");
        }
        
        if (!actions) {
            return numbers;
        }

        // Convert negative numbers to 0 and create array of digits
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
                    numArray[currentPos] = numArray[currentPos] === '9' 
                        ? '9' 
                        : String(Number(numArray[currentPos]) + 1);
                    i++;
                    break;
                    
                case 'D':
                    numArray[currentPos] = numArray[currentPos] === '0' 
                        ? '0' 
                        : String(Number(numArray[currentPos]) - 1);
                    i++;
                    break;
                    
                case 'S':
                    if (i + 1 < actions.length) {
                        const swapPos = Number(actions[i + 1]) - 1;
                        if (swapPos >= 0 && swapPos < numArray.length) {
                            // Perform swap
                            [numArray[currentPos], numArray[swapPos]] = 
                            [numArray[swapPos], numArray[currentPos]];
                        }
                        i += 2; // Skip the next character as it's part of swap instruction
                    } else {
                        i++; // Move to next action if S is not followed by a number
                    }
                    break;
                    
                default:
                    i++; // Skip invalid actions
            }
        }
        
        return numArray.join('');
    }
}

module.exports = { DocumentEncryptor };