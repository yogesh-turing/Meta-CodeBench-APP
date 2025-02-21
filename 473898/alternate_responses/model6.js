function multiplyLargeNumbers(num1, num2) {
    // Convert numbers to strings to handle large numbers
    let strNum1 = num1.toString();
    let strNum2 = num2.toString();

    // Base case: if either number is 0, return 0
    if (strNum1 === '0' || strNum2 === '0') {
        return 0;
    }

    // Find the length of the larger number
    let maxLength = Math.max(strNum1.length, strNum2.length);

    // Pad the shorter number with zeros
    if (strNum1.length < maxLength) {
        strNum1 = strNum1.padStart(maxLength, '0');
    }
    if (strNum2.length < maxLength) {
        strNum2 = strNum2.padStart(maxLength, '0');
    }

    // Divide and Conquer
    let mid = Math.floor(maxLength / 2);
    let a = parseInt(strNum1.slice(0, mid));
    let b = parseInt(strNum1.slice(mid));
    let c = parseInt(strNum2.slice(0, mid));
    let d = parseInt(strNum2.slice(mid));

    // Recursive calls
    let ac = multiplyLargeNumbers(a, c);
    let bd = multiplyLargeNumbers(b, d);
    let ad_bc = multiplyLargeNumbers(a + b, c + d) - ac - bd;

    // Combine results
    let result = ac * Math.pow(10, maxLength) + ad_bc * Math.pow(10, mid) + bd;

    return result;
}

module.exports = { multiplyLargeNumbers };