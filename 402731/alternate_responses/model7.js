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

    let layers = 0;
    let top = 0;
    let bottom = n - 1;
    let left = 0;
    let right = m - 1;

    while (top < bottom && left < right) {
        // Check if the current layer is symmetrical
        if (isSymmetrical(rug, top, bottom, left, right)) {
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

    // If there's a single row or column left in the middle, count it as a layer
    if (top === bottom && left === right) {
        layers++;
    }

    return layers;
}

// Helper function to check if a layer is symmetrical
function isSymmetrical(rug, top, bottom, left, right) {
    for (let i = left; i <= right; i++) {
        if (rug[top][i] !== rug[bottom][right - i + left]) {
            return false;
        }
    }

    for (let i = top; i <= bottom; i++) {
        if (rug[i][left] !== rug[bottom - i + top][right]) {
            return false;
        }
    }

    return true;
}

module.exports = {countLayers};