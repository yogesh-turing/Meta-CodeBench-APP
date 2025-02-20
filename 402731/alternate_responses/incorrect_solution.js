function countLayers(rug) {
    if (!rug || rug.length === 0) {
        throw new Error("Invalid input");
    }

    const n = rug.length;
    const m = rug[0].length;

    // Validate that all rows have the same length and contain only 'R', 'G', or 'B'
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

    let count = 0;
    const min = Math.min(n, m);

    for (let i = 0; i < Math.floor(min / 2); i++) {
        // Check horizontal symmetry
        for (let j = i; j < m - i; j++) {
            if (rug[i][j] !== rug[n - i - 1][j]) {
                return count;
            }
        }
        // Check vertical symmetry
        for (let j = i; j < n - i; j++) {
            if (rug[j][i] !== rug[j][m - i - 1]) {
                return count;
            }
        }
        count++;
    }

    if (min % 2 === 1) {
        // If there is an odd number of layers, check the center layer
        const centerChar = rug[Math.floor(min / 2)][Math.floor(min / 2)];
        for (let j = Math.floor(min / 2); j < m - Math.floor(min / 2); j++) {
            if (rug[Math.floor(min / 2)][j] !== centerChar) {
                return count;
            }
        }
        for (let j = Math.floor(min / 2); j < n - Math.floor(min / 2); j++) {
            if (rug[j][Math.floor(min / 2)] !== centerChar) {
                return count;
            }
        }
        count++;
    }

    return count;
}

// Export the function for testing
module.exports = {countLayers};