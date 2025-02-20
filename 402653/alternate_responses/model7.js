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
        let startNum = BigInt(num);  // Start from the provided number

        while (true) {
            let product = 1n;
            let currentNum = startNum.toString();

            // Check if the number is zero-free
            if (currentNum.includes('0')) {
                startNum++;
                continue;
            }

            // Calculate the product of digits
            for (let i = 0; i < currentNum.length; i++) {
                product *= BigInt(currentNum[i]);
            }

            // Check if the product of digits is divisible by t
            if (product % BigInt(t) === 0n) {
                return currentNum;
            }

            // If the product of digits is greater than t and t is not divisible by the product,
            // it means that the number cannot be divisible by t, so we can break the loop
            if (product > BigInt(t) && BigInt(t) % product !== 0n) {
                return "-1";
            }

            // Increment the number and continue
            startNum++;
        }
    }
}

module.exports = { Solution };