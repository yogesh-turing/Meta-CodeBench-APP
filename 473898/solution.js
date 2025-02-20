/**
 * Multiplies two integers using the divide-and-conquer approach.
 * This method recursively splits the numbers into smaller parts, calculates
 * intermediate results, and combines them to compute the final product.
 *
 * @param {number} num1 The first integer to multiply.
 * @param {number} num2 The second integer to multiply.
 * @return {number} The product of the two integers.
 */
function multiplyLargeNumbers(num1, num2) {
  if (num1 < 10 || num2 < 10) {
    return num1 * num2;
  }

  const maxLength = Math.max(num1.toString().length, num2.toString().length);
  const halfLength = Math.floor(maxLength / 2);

  // Split the first number into two parts
  const a1 = Math.floor(num1 / Math.pow(10, halfLength));
  const a2 = num1 % Math.pow(10, halfLength);

  // Split the second number into two parts
  const b1 = Math.floor(num2 / Math.pow(10, halfLength));
  const b2 = num2 % Math.pow(10, halfLength);

  // Recursively compute the products of the sub-problems
  const A = multiplyLargeNumbers(a1, b1);
  const B = multiplyLargeNumbers(a2, b2);
  const C = multiplyLargeNumbers(a1 + a2, b1 + b2) - A - B;

  // Combine the results to obtain the final product
  const result = A * Math.pow(10, 2 * halfLength) + C * Math.pow(10, halfLength) + B;

  return result;
}

module.exports = { multiplyLargeNumbers };