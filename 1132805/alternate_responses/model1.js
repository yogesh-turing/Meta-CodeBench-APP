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

    // Type check for object/array
    if (typeof input !== 'object') {
        return Array.from(keys);
    }

    // Circular reference check
    if (visited.has(input)) {
        throw new Error('Circular reference detected');
    }
    visited.add(input);

    // Process all enumerable properties
    for (const key in input) {
        keys.add(key);
        
        if (typeof input[key] === 'object' && input[key] !== null) {
            extractDeepKeys(
                input[key],
                maxDepth,
                currentDepth + 1,
                visited,
                keys
            );
        }
    }

    return Array.from(keys);
};

module.exports = { extractDeepKeys };