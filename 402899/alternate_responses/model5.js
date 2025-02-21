class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
        // Input validation
        if (!numbers || numbers.trim() === '') {
            throw new IllegalArgumentException("Input string cannot be empty");
        }
        
        // Check if input contains only numbers (and possibly negative signs)
        if (!/^-?\d+$/.test(numbers)) {
            throw new IllegalArgumentException("Input must contain only numbers");
        }
        
        // If actions is empty, return original string
        if (!actions || actions.length === 0) {
            return numbers;
        }

        // Convert string to array and handle negative numbers
        let nums = numbers.split('').map(char => {
            if (char === '-') return '0';
            return char;
        });
        
        let currentPos = 0;
        let i = 0;
        
        while (i < actions.length) {
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
                    if (nums[currentPos] !== '9') {
                        nums[currentPos] = String(parseInt(nums[currentPos]) + 1);
                    }
                    i++;
                    break;
                    
                case 'D':
                    if (nums[currentPos] !== '0') {
                        nums[currentPos] = String(parseInt(nums[currentPos]) - 1);
                    }
                    i++;
                    break;
                    
                case 'S':
                    if (i + 1 < actions.length) {
                        const swapPos = parseInt(actions[i + 1]);
                        if (!isNaN(swapPos) && swapPos <= nums.length) {
                            // Perform swap
                            const temp = nums[currentPos];
                            nums[currentPos] = nums[swapPos - 1];
                            nums[swapPos - 1] = temp;
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
                    break;
            }
        }
        
        return nums.join('');
    }
}

module.exports = { DocumentEncryptor };