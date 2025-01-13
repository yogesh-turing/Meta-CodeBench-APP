function flattenArr(arr) {
  if (!Array.isArray(arr)) return arr; // Return the input as is if it's not an array

  const result = [];
  const stack = [...arr]; // Initialize the stack with the input array

  while (stack.length > 0) {
    const item = stack.shift(); // Get the next item from the stack
    if (Array.isArray(item)) {
      stack.unshift(...item); // If the item is an array, add its elements to the stack
    } else {
      result.push(item); // If the item is not an array, add it to the result
    }
  }

  return result;
}

const nestedArray = [1, [2, [3, [4, [5]]]]];
console.log(flattenArr(nestedArray)); // [1, 2, 3, 4, 5]

console.log(flattenArr(34)); // 34

module.exports = { flattenArr };