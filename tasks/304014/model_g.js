function flattenArr(arr) {
  if (!Array.isArray(arr)) return arr; // Return non-array input as is

  const result = [];
  const stack = [...arr];

  while (stack.length > 0) {
    const current = stack.shift();

    if (Array.isArray(current)) {
      stack.unshift(...current); // Add nested array elements to the stack
    } else {
      result.push(current); // Add non-array element to the result
    }
  }

  return result;
}

const nestedArray = [1, [2, [3, [4, [5]]]]];
console.log(flattenArr(nestedArray)); // [1, 2, 3, 4, 5]

console.log(flattenArr(34)); // 34

module.exports = { flattenArr };