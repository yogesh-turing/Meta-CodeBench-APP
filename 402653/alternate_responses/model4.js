class Solution {
    // Helper function to check if a number is zero-free
    static isZeroFree(num) {
        return !num.includes('0');
    }

    // Helper function to calculate digit product
    static getDigitProduct(numStr) {
        let product = 1n;
        for (let digit of numStr) {
            product *= BigInt(digit);
        }
        return product;
    }

    static smallest(num, t) {
        // Input validation
        if (!num || t <= 0) return "-1";
        
        let currentNum = BigInt(num);
        const target = BigInt(t);

        while (true) {
            const numStr = currentNum.toString();
            
            // Check if number is zero-free
            if (this.isZeroFree(numStr)) {
                // Calculate product of digits
                const digitProduct = this.getDigitProduct(numStr);
                
                // Check if product is divisible by t
                if (digitProduct % target === 0n) {
                    return numStr;
                }
            }

            // Handle potential overflow
            if (currentNum >= Number.MAX_SAFE_INTEGER) {
                return "-1";
            }

            currentNum++;
        }
    }

    // Helper function for GCD calculation (kept for completeness)
    static gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}

module.exports = { Solution };