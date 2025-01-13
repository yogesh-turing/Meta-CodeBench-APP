function flattenArr(arr) {
  if (!Array.isArray(arr)) {
      return arr;
  }
  const result = [];
  const stack = [...arr];
  while (stack.length) {
      const item = stack.shift();
      if (Array.isArray(item)) {
          stack.unshift(...item);
      } else {
          result.push(item);
      }
  }
  return result;
}

const nestedArray = [1, [2, [3, [4, [5]]]]];
console.log(flattenArr(nestedArray)); // [1, 2, 3, 4, 5]

const nonArrayInput = 34;
console.log(flattenArr(nonArrayInput)); // 34

module.exports = { flattenArr };