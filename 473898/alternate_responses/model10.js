function multiplyLargeNumbers(num1, num2) {
    // Convert the numbers to strings to easily extract the digits
    let num1Str = num1.toString();
    let num2Str = num2.toString();
    
    // Base case: if either number is 0, return 0
    if (num1Str === '0' || num2Str === '0') {
        return 0;
    }
    
    // Calculate the length of the numbers
    let n = Math.max(num1Str.length, num2Str.length);
    
    // Pad the numbers with leading zeros to make them the same length
    num1Str = num1Str.padStart(n, '0');
    num2Str = num2Str.padStart(n, '0');
    
    // Split the numbers into two halves
    let a = parseInt(num1Str.slice(0, n / 2));
    let b = parseInt(num1Str.slice(n / 2));
    let c = parseInt(num2Str.slice(0, n / 2));
    let d = parseInt(num2Str.slice(n / 2));
    
    // Recursively calculate the products of the halves
    let ac = multiplyLargeNumbers(a, c);
    let bd = multiplyLargeNumbers(b, d);
    let ad_bc = multiplyLargeNumbers(a + b, c + d) - ac - bd;
    
    // Combine the products using the divide and conquer formula
    let product = ac * Math.pow(10, n) + (ad_bc * Math.pow(10, n / 2)) + bd;
    
    return product;
}

module.exports = { multiplyLargeNumbers };