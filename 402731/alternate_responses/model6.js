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
        let isLayerSymmetric = true;

        // Check top and bottom edges
        for (let i = left; i <= right; i++) {
            if (rug[top][i] !== rug[bottom][i]) {
                isLayerSymmetric = false;
                break;
            }
        }

        // Check left and right edges
        for (let i = top; i <= bottom; i++) {
            if (rug[i][left] !== rug[i][right]) {
                isLayerSymmetric = false;
                break;
            }
        }

        if (isLayerSymmetric) {
            layers++;
            top++;
            bottom--;
            left++;
            right--;
        } else {
            break;
        }
    }

    // Check if the center is symmetric
    if (top === bottom && left === right) {
        layers++;
    }

    return layers;
}

module.exports = { countLayers };