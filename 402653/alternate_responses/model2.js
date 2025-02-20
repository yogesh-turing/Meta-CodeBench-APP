class Solution {
    // Helper function to check if a number is zero-free
    static isZeroFree(num) {
        return !num.toString().includes('0');
    }

    // Helper function to calculate digit product
    static getDigitProduct(numStr) {
        let product = 1n;
        for (let digit of numStr) {
            product *= BigInt(digit);
        }
        return product;
    }

    // Main function to find the smallest valid number
    static smallest(num, t) {
        // Input validation
        if (!num || !t || t <= 0) return "-1";
        
        try {
            const target = BigInt(t);
            let current = BigInt(num);
            
            // Handle special cases
            if (target === 0n) return "-1";
            
            while (true) {
                // Convert to string for digit manipulation
                let currentStr = current.toString();
                
                // Check if number is zero-free
                if (this.isZeroFree(currentStr)) {
                    // Calculate product of digits
                    let digitProduct = this.getDigitProduct(currentStr);
                    
                    // Check if product is divisible by target
                    if (digitProduct % target === 0n) {
                        return currentStr;
                    }
                }
                
                // Generate next number
                current = current + 1n;
                
                // Optional: Add a limit to prevent infinite loops
                if (current > BigInt(num) + 10000n) {
                    return "-1";
                }
            }
        } catch (error) {
            return "-1";
        }
    }
}

module.exports = { Solution };