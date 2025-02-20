function multiplyLargeNumbers(num1, num2) {
    // Convert the numbers to strings to handle large numbers
    let strNum1 = num1.toString();
    let strNum2 = num2.toString();

    // Calculate the length of the numbers
    let len1 = strNum1.length;
    let len2 = strNum2.length;

    // Pad the numbers with zeros to make them the same length
    let maxLen = Math.max(len1, len2);
    strNum1 = strNum1.padStart(maxLen, '0');
    strNum2 = strNum2.padStart(maxLen, '0');

    // Perform the divide and conquer multiplication
    let result = multiply(strNum1, strNum2);

    // Convert the result back to a number
    return parseInt(result);
}

function multiply(num1, num2) {
    // Base case: if the numbers are single digits, multiply them directly
    if (num1.length === 1 || num2.length === 1) {
        return parseInt(num1) * parseInt(num2);
    }

    // Split the numbers into two halves
    let mid = Math.floor(num1.length / 2);
    let left1 = num1.slice(0, mid);
    let right1 = num1.slice(mid);
    let left2 = num2.slice(0, mid);
    let right2 = num2.slice(mid);

    // Recursively multiply the halves
    let leftProduct = multiply(left1, left2);
    let rightProduct = multiply(right1, right2);
    let crossProduct = multiply(left1, right2) + multiply(right1, left2);

    // Combine the products
    let result = leftProduct * Math.pow(10, 2 * mid) + crossProduct * Math.pow(10, mid) + rightProduct;

    return result.toString();
}

module.exports = { multiplyLargeNumbers };