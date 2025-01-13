function flattenArr(arr) {
    if (!Array.isArray(arr)) return arr;
  
    let result = [];
    let stack = [...arr];
  
    while (stack.length > 0) {
      let item = stack.shift();
  
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
  
  console.log(flattenArr(34)); // 34
  
  module.exports = { flattenArr };