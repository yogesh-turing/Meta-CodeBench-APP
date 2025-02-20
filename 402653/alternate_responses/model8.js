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

    // Function to generate the next "zero-free" number
    static nextZeroFree(num) {
        let currentNum = BigInt(num);

        while (true) {
            let hasZero = false;
            let tempNum = currentNum;

            // Check if the number contains the digit 0
            while (tempNum > 0) {
                if (tempNum % 10n === 0n) {
                    hasZero = true;
                    break;
                }
                tempNum = tempNum / 10n;
            }

            // If the number does not contain the digit 0, return it
            if (!hasZero) {
                return currentNum;
            }

            // Increment the number and continue
            currentNum++;
        }
    }

    static smallest(num, t) {
        let startNum = Solution.nextZeroFree(num);  // Start from the next "zero-free" number

        while (true) {
            let product = 1n;
            let tempNum = startNum;

            // Calculate the product of digits
            while (tempNum > 0) {
                product *= tempNum % 10n;
                tempNum = tempNum / 10n;
            }

            // Check if the product of digits is divisible by t
            if (product % BigInt(t) === 0n) {
                return startNum.toString();
            }

            // Generate the next "zero-free" number and continue
            startNum = Solution.nextZeroFree(startNum + 1n);
        }

        return "-1";  // If no such number is found, return "-1"
    }
}

module.exports = { Solution };