class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Validate input
        if (!numbers || !/^-?\d+$/.test(numbers)) {
            throw new IllegalArgumentException("Invalid input: Must contain only numbers");
        }
        
        if (!actions) return numbers;

        // Convert negative numbers to 0 and convert to array for manipulation
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
                        : String(parseInt(numArray[currentPos]) + 1);
                    i++;
                    break;
                    
                case 'D':
                    numArray[currentPos] = numArray[currentPos] === '0' 
                        ? '0' 
                        : String(parseInt(numArray[currentPos]) - 1);
                    i++;
                    break;
                    
                case 'S':
                    // Check if next character exists and is a number
                    if (i + 1 < actions.length && !isNaN(actions[i + 1])) {
                        const swapPos = parseInt(actions[i + 1]) - 1;
                        if (swapPos >= 0 && swapPos < numArray.length) {
                            // Perform swap
                            [numArray[currentPos], numArray[swapPos]] = 
                            [numArray[swapPos], numArray[currentPos]];
                        }
                        i += 2; // Skip the next character as it's part of swap instruction
                    } else {
                        i++; // Skip invalid swap instruction
                    }
                    break;
                    
                default:
                    i++; // Skip invalid instruction
            }
        }
        
        return numArray.join('');
    }
}

class IllegalArgumentException extends Error {
    constructor(message) {
        super(message);
        this.name = 'IllegalArgumentException';
    }
}

module.exports = { DocumentEncryptor };