class DocumentEncryptor {
    encryptNumbers(numbers, actions) {
      // Convert input string to an array for easier manipulation
      let nums = numbers.replace(/-\d+/g, '0').split('');
      let currentPos = 0;
  
      // Process each action
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
  
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
              nums[currentPos] = String.fromCharCode(nums[currentPos].charCodeAt(0) + 1);
            }
            break;
  
          case 'D':
            // Decrement current number if not 0
            if (nums[currentPos] > '0') {
              nums[currentPos] = String.fromCharCode(nums[currentPos].charCodeAt(0) - 1);
            }
            break;
  
          case 'S':
            // Handle swap operation
            if (i + 1 < actions.length) {
              try {
                const n = parseInt(actions[i + 1], 10);
                if (n > 0 && n < nums.length) {
                  // Perform swap
                  const temp = nums[currentPos];
                  nums[currentPos] = nums[n];
                  nums[n] = temp;
                }
                i++; // Skip the next character as it's part of swap command
              } catch (e) {
                // Invalid swap position, ignore
              }
            }
            break;
        }
      }
  
      return nums.join('');
    }
  }
  
  module.exports = {DocumentEncryptor};