class Solution {
    // Helper function to check if a number is zero-free
    static isZeroFree(num) {
        return !num.includes('0');
    }
    
    // Helper function to calculate product of digits
    static getDigitProduct(numStr) {
        let product = 1n;
        for (let digit of numStr) {
            product *= BigInt(digit);
        }
        return product;
    }
    
    static smallest(num, t) {
        // Convert t to BigInt
        const target = BigInt(t);
        
        // Handle edge cases
        if (target <= 0n) return "-1";
        
        let currentNum = BigInt(num);
        
        while (true) {
            // Convert current number to string for digit manipulation
            const currentStr = currentNum.toString();
            
            // Check if number is zero-free
            if (this.isZeroFree(currentStr)) {
                // Calculate product of digits
                const digitProduct = this.getDigitProduct(currentStr);
                
                // Check if product is divisible by target
                if (digitProduct % target === 0n) {
                    return currentStr;
                }
            }
            
            // Move to next number
            currentNum++;
            
            // Optional: Add a reasonable upper limit to prevent infinite loops
            if (currentNum > BigInt(num) + 1000000n) {
                return "-1";
            }
        }
    }
}

module.exports = { Solution };