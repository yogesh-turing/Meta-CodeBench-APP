function multiplyLargeNumbers(num1, num2) {
    // Convert to positive numbers for calculation
    const isNegative = (num1 < 0) ^ (num2 < 0);
    num1 = Math.abs(num1);
    num2 = Math.abs(num2);
    
    // Base case for small numbers
    if (num1 < 10 || num2 < 10) {
        return isNegative ? -(num1 * num2) : num1 * num2;
    }

    // Convert numbers to strings to get their lengths
    const n1 = num1.toString();
    const n2 = num2.toString();
    
    // Get the maximum length
    const maxLength = Math.max(n1.length, n2.length);
    
    // Calculate the middle point
    const mid = Math.floor(maxLength / 2);
    
    // Split the numbers
    const high1 = parseInt(n1.slice(0, n1.length - mid)) || 0;
    const low1 = parseInt(n1.slice(n1.length - mid)) || 0;
    const high2 = parseInt(n2.slice(0, n2.length - mid)) || 0;
    const low2 = parseInt(n2.slice(n2.length - mid)) || 0;
    
    // Recursive steps
    const z0 = multiplyLargeNumbers(low1, low2);
    const z1 = multiplyLargeNumbers((low1 + high1), (low2 + high2));
    const z2 = multiplyLargeNumbers(high1, high2);
    
    // Combine the results
    const result = (z2 * Math.pow(10, 2 * mid)) + 
                  ((z1 - z2 - z0) * Math.pow(10, mid)) + 
                  z0;
    
    return isNegative ? -result : result;
}

module.exports = { multiplyLargeNumbers };