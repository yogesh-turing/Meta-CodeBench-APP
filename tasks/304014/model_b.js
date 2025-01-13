function flattenArr(input) {
    // Handle non-array inputs
    if (!Array.isArray(input)) {
        return input;
    }

    // Use native Array.flat() if available (modern browsers)
    if (typeof Array.prototype.flat === 'function') {
        return input.flat(Infinity);
    }

    // Fallback iterative implementation
    const stack = [input];
    const result = [];

    while (stack.length > 0) {
        const current = stack.pop();

        for (let i = current.length - 1; i >= 0; i--) {
            const item = current[i];
            if (Array.isArray(item)) {
                stack.push(item);
            } else {
                result.unshift(item);
            }
        }
    }

    return result;
}

module.exports = { flattenArr };