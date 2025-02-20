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

    // Find the center of the rug
    const centerX = Math.floor(n / 2);
    const centerY = Math.floor(m / 2);

    // Start from the center and check each layer
    let layerCount = 0;
    for (let layer = 0; layer <= Math.min(centerX, centerY); layer++) {
        // Check top and bottom edges
        for (let i = 0; i < m; i++) {
            if (rug[layer][i] !== rug[n - layer - 1][i]) {
                return layerCount;
            }
        }
        // Check left and right edges
        for (let i = 0; i < n; i++) {
            if (rug[i][layer] !== rug[i][m - layer - 1]) {
                return layerCount;
            }
        }
        layerCount++;
    }
    return layerCount;
}

module.exports = { countLayers };