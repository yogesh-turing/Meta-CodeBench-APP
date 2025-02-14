const extractDeepKeys = (input, maxDepth = Infinity, currentDepth = 0, visited = new WeakSet()) => {
    // Input validation
    if (typeof input !== 'object' || input === null) {
        throw new Error('Invalid input encountered');
    }

    // Validate maxDepth - allow Infinity as valid value
    if (typeof maxDepth !== 'number' || maxDepth < 0 || (!Number.isInteger(maxDepth) && maxDepth !== Infinity)) {
        throw new Error('maxDepth must be a non-negative integer or Infinity');
    }

    // Circular reference check before any processing
    if (visited.has(input)) {
        throw new Error('Circular reference detected');
    }
    visited.add(input);

    // Return empty array if max depth reached
    if (currentDepth >= maxDepth) {
        return [];
    }

    const extractedKeys = [];
    
    // Handle both arrays and objects
    Object.entries(input).forEach(([key, value]) => {
        // Skip array indices but process their nested objects
        if (Array.isArray(input) && !isNaN(Number(key))) {
            if (typeof value === 'object' && value !== null) {
                extractedKeys.push(...extractDeepKeys(value, maxDepth, currentDepth + 1, visited));
            }
            return;
        }

        // Add the current key
        extractedKeys.push(key);

        // Recurse for nested objects
        if (typeof value === 'object' && value !== null) {
            extractedKeys.push(...extractDeepKeys(value, maxDepth, currentDepth + 1, visited));
        }
    });

    return extractedKeys;
};

module.exports = { extractDeepKeys };
