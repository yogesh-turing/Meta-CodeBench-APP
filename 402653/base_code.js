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

            // Calculate the product of digits
            for (let i = 0; i < currentNum.length; i++) {
                product *= BigInt(currentNum[i]);
            }

            // Check if the product of digits is divisible by t
            if (product % BigInt(t) === 0n) {
                return currentNum;
            }

            // Increment the number and continue
            startNum++;
        }

        return "-1";  // If no such number is found, return "-1"
    }
}
module.exports = { Solution };