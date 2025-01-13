function flattenArr(arr) {
  if (!Array.isArray(arr)) {
    return arr;
  }

  const result = [];
  const stack = [...arr];

  while (stack.length > 0) {
    const current = stack.shift();
    if (Array.isArray(current)) {
      stack.unshift(...current);
    } else {
      result.push(current);
    }
  }

  return result;
}

const nestedArray = [1, [2, [3, [4, [5]]]]];
console.log(flattenArr(nestedArray)); // [1, 2, 3, 4, 5]

module.exports = { flattenArr };