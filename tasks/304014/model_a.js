function flattenArr(input) {
    // Handle non-array inputs
    if (!Array.isArray(input)) {
        return input;
    }

    const stack = [input];
    const result = [];

    while (stack.length > 0) {
        const current = stack.pop();
        
        for (let i = current.length - 1; i >= 0; i--) {
            const element = current[i];
            
            if (Array.isArray(element)) {
                stack.push(element);
            } else {
                result.unshift(element);
            }
        }
    }

    return result;
}

module.exports = { flattenArr };