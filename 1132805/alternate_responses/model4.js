const extractDeepKeys = (input, maxDepth = Infinity, currentDepth = 0, visited = new WeakSet(), result = new Set()) => {
    // Input validation
    if (input === null || input === undefined || typeof input === 'string' || typeof input === 'number') {
        throw new Error('Invalid input encountered');
    }

    if (!Number.isInteger(maxDepth) || maxDepth < 0) {
        throw new Error('maxDepth must be a non-negative integer');
    }

    // Base case for maxDepth
    if (currentDepth > maxDepth) {
        return Array.from(result);
    }

    // Type check for object/array
    if (typeof input !== 'object') {
        return Array.from(result);
    }

    // Circular reference check
    if (visited.has(input)) {
        throw new Error('Circular reference detected');
    }
    visited.add(input);

    // Process all enumerable properties
    for (const key in input) {
        result.add(key);
        
        // Only recurse if within maxDepth and value is an object
        if (currentDepth < maxDepth && 
            input[key] !== null && 
            typeof input[key] === 'object') {
            extractDeepKeys(input[key], maxDepth, currentDepth + 1, visited, result);
        }
    }

    return Array.from(result);
};

module.exports = { extractDeepKeys };