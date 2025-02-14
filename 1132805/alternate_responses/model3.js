const extractDeepKeys = (input, maxDepth = Infinity, currentDepth = 0, visited = new WeakSet(), result = new Set()) => {
    // Input validation
    if (currentDepth === 0) {
        if (input === null || input === undefined || typeof input !== 'object') {
            throw new Error('Invalid input encountered');
        }
        if (!Number.isInteger(maxDepth) || maxDepth < 0) {
            throw new Error('maxDepth must be a non-negative integer');
        }
        if (maxDepth === 0) {
            return [];
        }
    }

    // Circular reference check
    if (visited.has(input)) {
        throw new Error('Circular reference detected');
    }

    // Add object to visited set
    visited.add(input);

    // Process current object
    for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            result.add(key);
            
            const value = input[key];
            if (typeof value === 'object' && value !== null && currentDepth < maxDepth) {
                extractDeepKeys(value, maxDepth, currentDepth + 1, visited, result);
            }
        }
    }

    // Handle array indices if input is an array
    if (Array.isArray(input)) {
        for (let i = 0; i < input.length; i++) {
            const value = input[i];
            if (typeof value === 'object' && value !== null && currentDepth < maxDepth) {
                extractDeepKeys(value, maxDepth, currentDepth + 1, visited, result);
            }
        }
    }

    // Convert Set to Array only at the top level
    return currentDepth === 0 ? Array.from(result) : result;
};

module.exports = { extractDeepKeys };