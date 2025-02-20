class Solution {
    static isReacheable(start, end, n) {
        // Input validation
        if (!start || !end || typeof n !== 'number' || n < 0) {
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
            throw new Error("Positions must be within the grid (a1 to h8)");
        }

        // If start and end are same position
        if (start === end) {
            return true;
        }

        // If no moves allowed but positions different
        if (n === 0) {
            return false;
        }

        // Check if positions are on same diagonal
        if (this.sameDiagonal(startCol, startRow, endCol, endRow)) {
            return n >= 1;
        }

        // If we have at least 2 moves, any position is reachable
        // This is because we can always reach any square in 2 moves:
        // First move to a common diagonal, then to the target
        return n >= 2;
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }
}

module.exports = { Solution };