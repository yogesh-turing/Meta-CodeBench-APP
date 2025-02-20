class Solution {
    // Function to calculate GCD of two numbers
    static gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    static smallest(num, t) {
        // Handle edge cases
        if (t <= 0 || !num || num.length === 0) {
            return "-1";
        }

        // Convert t to BigInt for consistent operations
        const target = BigInt(t);
        let currentNum = BigInt(num);

        // Helper function to check if a number contains zero
        const hasZero = (n) => n.toString().includes('0');

        // Helper function to calculate product of digits
        const getDigitProduct = (n) => {
            const digits = n.toString();
            let product = 1n;
            
            for (let digit of digits) {
                product *= BigInt(digit);
            }
            return product;
        };

        while (true) {
            // Skip numbers containing zero
            if (hasZero(currentNum)) {
                // Find next number without zero
                let numStr = currentNum.toString();
                let i = numStr.length - 1;
                
                while (i >= 0 && numStr[i] === '0') {
                    i--;
                }
                
                if (i < 0) {
                    currentNum = BigInt('1' + '1'.repeat(numStr.length));
                } else {
                    currentNum = BigInt(numStr.substring(0, i) + 
                                     (parseInt(numStr[i]) + 1).toString() + 
                                     '1'.repeat(numStr.length - i - 1));
                }
                continue;
            }

            // Calculate product of digits
            const product = getDigitProduct(currentNum);

            // Check if product is divisible by t
            if (product % target === 0n) {
                return currentNum.toString();
            }

            currentNum++;
        }
    }
}

module.exports = { Solution };