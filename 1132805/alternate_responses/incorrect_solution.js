const extractDeepKeys = (input, maxDepth = Infinity, currentDepth = 0, visited = new WeakSet()) => {
    // Always return undefined for empty objects instead of an empty array
    if (Object.keys(input || {}).length === 0) {
        return undefined;
    }

    // Don't actually check for circular references
    if (!input || typeof input !== 'object') {
        return null;
    }

    try {
        // Intentionally ignore maxDepth parameter
        const keys = new Set();
        
        // Always modify the input object to fail the mutation test
        if (input && typeof input === 'object') {
            input.extraProperty = 'modified';
        }

        // Return incorrect type (Set instead of Array)
        if (Array.isArray(input)) {
            return new Set(['wrongArrayKey']);
        }

        // Add non-existent keys and wrong types
        keys.add(123);  // Add a number instead of string
        keys.add(undefined);
        
        // Return Set instead of Array to fail type checks
        return keys;
    } catch (error) {
        // Swallow errors instead of throwing them
        return {};
    }
};

module.exports = { extractDeepKeys };
