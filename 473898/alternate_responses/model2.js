function multiplyLargeNumbers(num1, num2) {
    // Convert any leading zeros and handle negative numbers
    num1 = Number(num1);
    num2 = Number(num2);
    
    // Handle sign separately
    const sign = Math.sign(num1) * Math.sign(num2);
    num1 = Math.abs(num1);
    num2 = Math.abs(num2);
    
    // Base cases
    if (num1 < 10 || num2 < 10) {
        return sign * (num1 * num2);
    }

    // Convert numbers to strings to get their lengths
    const n1 = num1.toString();
    const n2 = num2.toString();
    
    // Get the maximum length
    const m = Math.max(n1.length, n2.length);
    const m2 = Math.floor(m / 2);
    
    // Split the numbers
    const high1 = Math.floor(num1 / Math.pow(10, m2));
    const low1 = num1 % Math.pow(10, m2);
    const high2 = Math.floor(num2 / Math.pow(10, m2));
    const low2 = num2 % Math.pow(10, m2);
    
    // Recursive steps using Karatsuba algorithm
    const z0 = multiplyLargeNumbers(low1, low2);
    const z1 = multiplyLargeNumbers((low1 + high1), (low2 + high2));
    const z2 = multiplyLargeNumbers(high1, high2);
    
    // Combine the results
    const result = (z2 * Math.pow(10, m2 * 2)) + 
                  ((z1 - z2 - z0) * Math.pow(10, m2)) + 
                  z0;
                  
    return sign * result;
}

module.exports = { multiplyLargeNumbers };