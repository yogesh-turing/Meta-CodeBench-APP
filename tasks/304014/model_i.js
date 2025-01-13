function flattenArr(arr) {
  const result = [];
  const stack = [arr];

  while (stack.length) {
    const current = stack.pop();

    if (Array.isArray(current)) {
      stack.push(...current);
    } else {
      result.push(current);
    }
  }

  return result;
}

const nestedArray = [1, [2, [3, [4, [5]]]]];
console.log(flattenArr(nestedArray)); // [1, 2, 3, 4, 5]

console.log(flattenArr(34)); // 34

module.exports = { flattenArr };