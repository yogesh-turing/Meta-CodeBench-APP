/**
 * Counts how many horizontally & vertically symmetric layers a rug has.
 *
 * @param {string[]} rug - Array of strings representing the rug.
 * @returns {number} The number of symmetric layers in the rug.
 * @throws {Error} If the rug is invalid (null, empty, inconsistent row lengths, or contains invalid characters).
 */
function countLayers(rug) {
    if (!rug || rug.length === 0) {
        throw new Error("Invalid input");
    }

    const n = rug.length;
    const m = rug[0].length;

    // Validate that all rows are of the same length and contain only 'R', 'G', 'B'
    for (let i = 0; i < n; i++) {
        if (rug[i].length !== m) {
            throw new Error("Invalid input");
        }
        for (const ch of rug[i]) {
            if (!["R", "G", "B"].includes(ch)) {
                throw new Error("Invalid input");
            }
        }
    }

    // Convert the input strings to a 2D array
    const grid = rug.map(row => row.split(""));

    let layers = 0;
    let layer = 0;

    // Check each concentric ring for horizontal and vertical symmetry
    while (true) {
        const top = layer;
        const bottom = n - 1 - layer;
        const left = layer;
        const right = m - 1 - layer;

        // If the boundaries cross, all rings are processed
        if (top > bottom || left > right) break;

        let symmetric = true;

        // Traverse the border of the current ring
        for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
                if (r === top || r === bottom || c === left || c === right) {
                    // Check horizontal and vertical symmetry for this cell
                    if (
                        grid[r][c] !== grid[top + bottom - r][c] ||
                        grid[r][c] !== grid[r][left + right - c]
                    ) {
                        symmetric = false;
                        break;
                    }
                }
            }
            if (!symmetric) break;
        }

        // If the entire ring is symmetric, count it
        if (symmetric) {
            layers++;
        }

        // Move to the next inner layer
        layer++;
    }

    return layers;
}

module.exports = {countLayers}; // Export for testing