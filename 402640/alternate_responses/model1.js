class Solution {
    static isReacheable(start, end, n) {
        // Input validation
        if (!start || !end || typeof start !== 'string' || typeof end !== 'string' ||
            start.length !== 2 || end.length !== 2 || typeof n !== 'number' || n < 0) {
            throw new Error("Invalid input parameters");
        }

        // Convert positions to coordinates
        const startCol = start.charCodeAt(0) - 'a'.charCodeAt(0);
        const startRow = parseInt(start[1]) - 1;
        const endCol = end.charCodeAt(0) - 'a'.charCodeAt(0);
        const endRow = parseInt(end[1]) - 1;

        // Validate coordinates are within grid
        if (startCol < 0 || startCol > 7 || startRow < 0 || startRow > 7 ||
            endCol < 0 || endCol > 7 || endRow < 0 || endRow > 7) {
            throw new Error("Coordinates must be within the 8x8 grid");
        }

        // If start and end are the same, no moves needed
        if (start === end) {
            return true;
        }

        // If no moves allowed but positions are different
        if (n === 0) {
            return false;
        }

        // If positions are on the same diagonal, need 1 move
        if (this.sameDiagonal(startCol, startRow, endCol, endRow)) {
            return n >= 1;
        }

        // If not on same diagonal, need 2 moves
        return n >= 2;
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }
}

module.exports = { Solution };