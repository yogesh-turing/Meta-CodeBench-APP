class Solution {
    // Function to calculate GCD (Greatest Common Divisor) of two numbers
    static gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    static smallest(num, t) {
        // Input validation
        if (!num || t <= 0) return "-1";
        
        let startNum = BigInt(num);
        const target = BigInt(t);

        // Helper function to check if a number contains zero
        const hasZero = (n) => n.toString().includes('0');

        // Helper function to calculate product of digits
        const getDigitProduct = (n) => {
            const digits = n.toString();
            let product = 1n;
            
            for (let digit of digits) {
                if (digit === '0') return 0n;
                product *= BigInt(digit);
            }
            return product;
        };

        while (true) {
            // Skip numbers containing zero
            if (hasZero(startNum)) {
                // Find next number without zero
                let numStr = startNum.toString();
                let i = numStr.length - 1;
                
                while (i >= 0 && numStr[i] === '0') {
                    i--;
                }
                
                if (i < 0) {
                    let len = numStr.length;
                    startNum = BigInt('1' + '1'.repeat(len));
                } else {
                    let prefix = numStr.slice(0, i);
                    startNum = BigInt(prefix + '1'.repeat(numStr.length - i));
                }
                continue;
            }

            // Calculate product of digits
            let product = getDigitProduct(startNum);
            
            // Check if product is divisible by target
            if (product !== 0n && product % target === 0n) {
                return startNum.toString();
            }

            startNum++;
        }
    }
}

module.exports = { Solution };