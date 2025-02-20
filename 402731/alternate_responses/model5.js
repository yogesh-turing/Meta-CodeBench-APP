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
        for (let col = left; col <= right && isSymmetrical; col++) {
            // If we're not on the same row (top !== bottom), check top-bottom symmetry
            if (top !== bottom && rug[top][col] !== rug[bottom][col]) {
                isSymmetrical = false;
            }
        }

        // Check vertical symmetry (left and right columns)
        for (let row = top; row <= bottom && isSymmetrical; row++) {
            // If we're not on the same column (left !== right), check left-right symmetry
            if (left !== right && rug[row][left] !== rug[row][right]) {
                isSymmetrical = false;
            }
        }

        // If layer is not symmetrical, break
        if (!isSymmetrical) {
            break;
        }

        // Check if all characters in the current layer are the same
        const currentChar = rug[top][left];
        let allSame = true;

        // Check top and bottom rows
        for (let col = left; col <= right && allSame; col++) {
            if (rug[top][col] !== currentChar || 
                (top !== bottom && rug[bottom][col] !== currentChar)) {
                allSame = false;
            }
        }

        // Check left and right columns
        for (let row = top + 1; row < bottom && allSame; row++) {
            if (rug[row][left] !== currentChar || 
                (left !== right && rug[row][right] !== currentChar)) {
                allSame = false;
            }
        }

        // If all characters are the same and the layer is symmetrical, count it
        if (allSame) {
            layers++;
        } else {
            break;
        }

        // Move to next inner layer
        top++;
        bottom--;
        left++;
        right--;
    }

    return layers;
}

module.exports = {countLayers};