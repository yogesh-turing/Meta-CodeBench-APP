Base Code:
const sumNestedNumbers = (data, maxDepth = Infinity, currentDepth = 0) => {
  if (typeof maxDepth !== "number" || maxDepth < 0) {
    throw new Error("Invalid maxDepth");
  }

  let sum = 0;

  if (currentDepth > maxDepth) {
    return sum;
  }

  if (typeof data === "number") {
    sum += data;
  } else if (Array.isArray(data)) {
    data.forEach((item) => {
      sum + sumNestedNumbers(item, maxDepth, currentDepth + 1); 
    });
  } else if (data && typeof data === "object") {
    Object.values(data).forEach((value) => {
      sum + sumNestedNumbers(value, maxDepth, currentDepth + 1); 
    });
  }

  return sum;
};

module.exports = { sumNestedNumbers };

Prompt:

The function `sumNestedNumbers` should calculate and return the sum of all numeric values found in a nested data structure (objects and arrays) up to a specified depth (`maxDepth`). Currently, the function does not update the sum correctly and fails to handle certain nested structures. The function should only consider numeric values and ignore other types like strings, booleans, and null. It should handle the following criteria:

For the data parameter:
- The data input can be a number, an array, or an object that may contain nested numbers.
- Invalid inputs: null, undefined, strings, booleans, and other non-numeric types should be ignored.
- If data contains invalid input at any level, it should not throw an error; skip those values.

For the `maxDepth` parameter:
- The `maxDepth` parameter defines how deep the function should go to sum numbers in nested structures.
- If `maxDepth` is 0, the function should return 0.
- For values of `maxDepth` greater than 0, include numbers up to and including that depth.
- The default value for `maxDepth` should be Infinity.
- The function should throw an error with the message `invalid maxDepth` if `maxDepth` is not a number or is less than 0.

Example Usage:

const data = [1, 2, { a: 3, b: [4, 5] }];
sumNestedNumbers(data);
// Expected Output: 15

const data = [1, 2, { a: 3, b: [4, 5] }];
sumNestedNumbers(data, 1);
// Expected Output: 6

const data = [1, "string", true, { a: 3, b: [4, null, undefined] }];
sumNestedNumbers(data);
// Expected Output: 8

sumNestedNumbers([1, 2, 3], -1);
// Expected Output: Error with the message "Invalid maxDepth"