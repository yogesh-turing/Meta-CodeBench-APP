function flattenArr(input) {
  if (!Array.isArray(input)) {
    throw new TypeError('Input must be an array');
  }

  const stack = [input];
  const result = [];

  while (stack.length > 0) {
    const current = stack.pop();
    for (let i = current.length - 1; i >= 0; i--) {
      if (Array.isArray(current[i])) {
        stack.push(current[i]);
      } else {
        result.unshift(current[i]);
      }
    }
  }

  return result;
}

module.exports = { flattenArr };