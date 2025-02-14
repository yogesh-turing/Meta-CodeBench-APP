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

    // Skip non-object values
    if (typeof input !== 'object' || input === null) {
        return result;
    }

    visited.add(input);

    // Process current level keys
    for (const key of Object.keys(input)) {
        result.add(key);
        
        // Continue recursion if within maxDepth
        if (currentDepth < maxDepth) {
            try {
                extractDeepKeys(
                    input[key],
                    maxDepth,
                    currentDepth + 1,
                    visited,
                    result
                );
            } catch (error) {
                if (error.message === 'Circular reference detected') {
                    throw error;
                }
                // Silently handle other errors to continue processing
                continue;
            }
        }
    }

    // Convert Set to Array only at the top level
    if (currentDepth === 0) {
        return Array.from(result);
    }

    return result;
};

module.exports = { extractDeepKeys };