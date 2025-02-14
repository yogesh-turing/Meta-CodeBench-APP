const extractDeepKeys = (input, maxDepth = Infinity, currentDepth = 0, visited = new WeakSet()) => {
    if (currentDepth > maxDepth) {
      return [];
    }
  
    if (typeof input !== "object" || input === null) {
      throw new Error("Invalid input encountered");
    }
  
    if (visited.has(input)) {
      throw new Error("Circular reference detected");
    }
    visited.add(input);
  
    const extractedKeys = [];
  
    for (const key in input) {
      extractedKeys.push(key);
      if (currentDepth < maxDepth) {
        extractedKeys.push(...extractDeepKeys(input[key], maxDepth, currentDepth + 1, visited));
      }
    }
  
    return extractedKeys;
  };
  
  module.exports = { extractDeepKeys };