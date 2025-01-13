function flattenArr(arr) {
    if (!Array.isArray(arr)) return arr; // return the input if it is not an array
  
    const result = [];
    const stack = [...arr]; // initialize the stack with the input array
  
    while (stack.length) {
      const item = stack.pop(); // pop the last element from the stack
  
      if (Array.isArray(item)) {
        stack.push(...item); // if the item is an array, push its elements back to the stack
      } else {
        result.push(item); // if the item is not an array, push it to the result
      }
    }
  
    return result;
  }
  
  const nestedArray = [1, [2, [3, [4, [5]]]]];
  console.log(flattenArr(nestedArray)); // [5, 4, 3, 2, 1]
  
  const nonArrayInput = 34;
  console.log(flattenArr(nonArrayInput)); // 34
  
  module.exports = { flattenArr };