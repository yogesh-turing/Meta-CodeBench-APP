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

    while (top <= bottom && left <= right) {
        // Check if current layer is symmetrical
        let isSymmetrical = true;

        // Check horizontal symmetry (top and bottom rows)
        for (let i = left; i <= right && isSymmetrical; i++) {
            // Check top row symmetry
            if (top !== bottom && rug[top][i] !== rug[bottom][i]) {
                isSymmetrical = false;
            }
            // Check left column symmetry
            if (left !== right && rug[i < n ? i : bottom][left] !== rug[i < n ? i : bottom][right]) {
                isSymmetrical = false;
            }
        }

        // Check vertical symmetry (left and right columns)
        for (let i = top; i <= bottom && isSymmetrical; i++) {
            if (left !== right && rug[i][left] !== rug[i][right]) {
                isSymmetrical = false;
            }
        }

        // Check if the entire layer has the same color
        const layerColor = rug[top][left];
        for (let i = top; i <= bottom && isSymmetrical; i++) {
            for (let j = left; j <= right && isSymmetrical; j++) {
                if (i === top || i === bottom || j === left || j === right) {
                    if (rug[i][j] !== layerColor) {
                        isSymmetrical = false;
                    }
                }
            }
        }

        if (!isSymmetrical) {
            break;
        }

        layers++;
        top++;
        bottom--;
        left++;
        right--;
    }

    return layers;
}

module.exports = {countLayers};