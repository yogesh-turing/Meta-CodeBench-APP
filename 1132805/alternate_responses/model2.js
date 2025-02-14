const extractDeepKeys = (input, maxDepth = Infinity, currentDepth = 0, visited = new WeakSet(), keys = new Set()) => {
    // Input validation
    if (input === null || input === undefined || typeof input === 'string' || typeof input === 'number') {
        throw new Error('Invalid input encountered');
    }

    if (!Number.isInteger(maxDepth) || maxDepth < 0) {
        throw new Error('maxDepth must be a non-negative integer');
    }

    // Base case for maxDepth
    if (currentDepth > maxDepth) {
        return Array.from(keys);
    }

    // Handle non-object types
    if (typeof input !== 'object') {
        return Array.from(keys);
    }

    // Check for circular references
    if (visited.has(input)) {
        throw new Error('Circular reference detected');
    }

    // Mark object as visited
    visited.add(input);

    // Process current object's keys
    for (const key in input) {
        keys.add(key);
        
        // Only recurse if within maxDepth and value is an object
        if (currentDepth < maxDepth && input[key] && typeof input[key] === 'object') {
            extractDeepKeys(input[key], maxDepth, currentDepth + 1, visited, keys);
        }
    }

    // Handle array-like objects
    if (Array.isArray(input)) {
        for (let i = 0; i < input.length; i++) {
            if (input[i] && typeof input[i] === 'object') {
                extractDeepKeys(input[i], maxDepth, currentDepth + 1, visited, keys);
            }
        }
    }

    return Array.from(keys);
};

module.exports = { extractDeepKeys };