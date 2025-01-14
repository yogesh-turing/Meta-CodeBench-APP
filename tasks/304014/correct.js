function flattenArr(arr) {

  if (!Array.isArray(arr)) {
    return arr;
  }

  const stack = [...arr];
  const result = [];

  while (stack.length > 0) {
    const current = stack.pop();

    if (Array.isArray(current)) {
      stack.push(...current); // Flatten one level by spreading the array
    } else {
      result.push(current);
    }
  }

  return result.reverse(); // Reverse to maintain original order
}

const nestedArray = [1, [2, [3, [4, [5]]]]];
console.log(flattenArr(nestedArray)); // [1, 2, 3, 4, 5]

const nonArrayInput = 'hello';
console.log(flattenArr(nonArrayInput)); // 'hello'

const deeplyNestedArray = Array(10000).fill(0).map(() => [1, [2, [3, [4, [5]]]]]);
console.log(flattenArr(deeplyNestedArray)); // [1, 2, 3, 4, 5, ...]

module.exports = { flattenArr };