function multiplyLargeNumbers(num1, num2) {
    // Convert to positive numbers for calculation
    const isNegative = (num1 < 0) ^ (num2 < 0);
    num1 = Math.abs(num1);
    num2 = Math.abs(num2);
    
    // Base cases for small numbers
    if (num1 < 10 || num2 < 10) {
        return isNegative ? -(num1 * num2) : num1 * num2;
    }

    // Convert numbers to strings to get their lengths
    const n1 = num1.toString();
    const n2 = num2.toString();
    
    // Get the maximum length
    const maxLength = Math.max(n1.length, n2.length);
    
    // Calculate the split point (middle)
    const m = Math.floor(maxLength / 2);
    
    // Split the numbers
    const high1 = Math.floor(num1 / Math.pow(10, m));
    const low1 = num1 % Math.pow(10, m);
    const high2 = Math.floor(num2 / Math.pow(10, m));
    const low2 = num2 % Math.pow(10, m);
    
    // Recursive steps using Karatsuba algorithm
    const z0 = multiplyLargeNumbers(low1, low2);
    const z1 = multiplyLargeNumbers((low1 + high1), (low2 + high2));
    const z2 = multiplyLargeNumbers(high1, high2);
    
    const result = (z2 * Math.pow(10, 2 * m)) + 
                  ((z1 - z2 - z0) * Math.pow(10, m)) + 
                  z0;
    
    return isNegative ? -result : result;
}

module.exports = { multiplyLargeNumbers };