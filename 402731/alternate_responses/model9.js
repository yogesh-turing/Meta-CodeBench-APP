function countLayers(rug) {
    if (!rug || rug.length === 0) {
        throw new Error("Rug cannot be null or empty.");
    }

    const n = rug.length;
    const m = rug[0].length;

    // Validate that all rows are of the same length and characters are valid ('R', 'G', 'B')
    for (let i = 0; i < n; i++) {
        // Check for consistent row lengths
        if (rug[i].length !== m) {
            throw new Error("All rows must have the same length.");
        }
        // Check each character in the row
        for (const ch of rug[i]) {
            if (!['R', 'G', 'B'].includes(ch)) {
                throw new Error(`Invalid character found: ${ch}. Only 'R', 'G', or 'B' are allowed.`);
            }
        }
    }

    // Count the number of symmetrical layers
    let layers = 0;
    let top = 0;
    let bottom = n - 1;
    let left = 0;
    let right = m - 1;

    while (top <= bottom && left <= right) {
        const topLeft = rug[top][left];
        const topRight = rug[top][right];
        const bottomLeft = rug[bottom][left];
        const bottomRight = rug[bottom][right];

        // Check if the current layer is symmetrical
        if (topLeft === topRight && topLeft === bottomLeft && topLeft === bottomRight) {
            layers++;
        } else {
            break;
        }

        // Move to the next layer
        top++;
        bottom--;
        left++;
        right--;
    }

    return layers;
}

module.exports = {countLayers};