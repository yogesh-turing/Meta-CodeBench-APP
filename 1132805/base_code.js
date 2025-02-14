const extractDeepKeys = (input, maxDepth, currentDepth = 0, visited = new WeakSet()) => {
    const extractedKeys = [];
  
    if (currentDepth > maxDepth || typeof input !== "object" || input === null) {
      return extractedKeys;
    }
  
    if (visited.has(input)) {
      throw new Error("Circular reference detected");
    }
    visited.add(input);
  
    for (const key in input) {
      extractedKeys.push(key);
      extractDeepKeys(input[key], maxDepth, currentDepth + 1, visited);
    }
  
    return extractedKeys;
  };
  
  module.exports = { extractDeepKeys };