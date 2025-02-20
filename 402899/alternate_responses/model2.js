class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Input validation
        if (!numbers || !this.isNumeric(numbers)) {
            throw new IllegalArgumentException("Invalid input: Input must contain numeric data");
        }
        
        if (!actions) return numbers;
        
        // Convert input string to array for easier manipulation
        let nums = numbers.split('').map(num => {
            // Convert negative numbers to 0
            return parseInt(num) < 0 ? '0' : num;
        });
        
        let currentPos = 0;
        let i = 0;
        
        while (i < actions.length) {
            // Ensure current position is within bounds
            if (currentPos < 0) currentPos = 0;
            if (currentPos >= nums.length) currentPos = nums.length - 1;
            
            const action = actions[i];
            
            switch (action) {
                case 'R':
                    currentPos = Math.min(currentPos + 1, nums.length - 1);
                    i++;
                    break;
                    
                case 'L':
                    currentPos = Math.max(currentPos - 1, 0);
                    i++;
                    break;
                    
                case 'T':
                    nums[currentPos] = nums[currentPos] === '9' ? 
                        '9' : String(parseInt(nums[currentPos]) + 1);
                    i++;
                    break;
                    
                case 'D':
                    nums[currentPos] = nums[currentPos] === '0' ? 
                        '0' : String(parseInt(nums[currentPos]) - 1);
                    i++;
                    break;
                    
                case 'S':
                    // Check if there's a number after 'S'
                    if (i + 1 < actions.length && !isNaN(actions[i + 1])) {
                        const swapPos = parseInt(actions[i + 1]) - 1;
                        // Validate swap position
                        if (swapPos >= 0 && swapPos < nums.length) {
                            // Perform swap
                            [nums[currentPos], nums[swapPos]] = 
                                [nums[swapPos], nums[currentPos]];
                        }
                        i += 2; // Skip the number after 'S'
                    } else {
                        i++; // Skip invalid swap action
                    }
                    break;
                    
                default:
                    i++; // Skip invalid action
            }
        }
        
        return nums.join('');
    }
    
    isNumeric(str) {
        return /^-?\d+$/.test(str);
    }
}

class IllegalArgumentException extends Error {
    constructor(message) {
        super(message);
        this.name = 'IllegalArgumentException';
    }
}

module.exports = { DocumentEncryptor };