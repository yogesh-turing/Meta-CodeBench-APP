class Solution {

    // Helper function to calculate the GCD (Greatest Common Divisor)
    // This is necessary if we want to use GCD-based logic in certain cases.
    static gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Function to calculate the smallest zero-free number whose digit product is divisible by 't'
    static smallest(num, t) {
        let start = BigInt(num);  // Convert string to BigInt for large numbers
        let tBigInt = BigInt(t);
        
        // Function to check if the number is zero-free
        const isZeroFree = (str) => !str.includes('0');
        
        // Function to calculate the product of digits of the number
        const digitProduct = (n) => {
            let product = 1n;
            while (n > 0) {
                let digit = n % 10n;
                if (digit === 0n) return 0n; // If zero found, product is zero
                product *= digit;
                n /= 10n;
            }
            return product;
        };
        
        // Start checking numbers from the 'start' value
        let numToCheck = start;
        while (true) {
            // Check if numToCheck is zero-free
            if (isZeroFree(numToCheck.toString())) {
                let product = digitProduct(numToCheck);
                if (product % tBigInt === 0n) {
                    return numToCheck.toString();
                }
            }
            
            // If no valid number found, increase numToCheck
            numToCheck += 1n;
            
            // Optional: A safeguard to prevent infinite loops in edge cases, such as very large 't'
            if (numToCheck > 10n**18n) {
                return "-1";  // No valid number found within a reasonable limit
            }
        }
    }
}

module.exports= {Solution};