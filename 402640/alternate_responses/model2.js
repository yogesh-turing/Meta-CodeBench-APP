class Solution {
    static isReacheable(start, end, n) {
        // Input validation
        if (!start || !end || typeof n !== 'number' || n < 0) {
            throw new Error("Invalid input parameters");
        }

        // Validate grid positions
        const validPos = /^[a-h][1-8]$/;
        if (!validPos.test(start) || !validPos.test(end)) {
            throw new Error("Invalid grid position");
        }

        // Convert chess notation to coordinates (0-based)
        const sX = start.charCodeAt(0) - 'a'.charCodeAt(0);
        const sY = parseInt(start[1]) - 1;
        const eX = end.charCodeAt(0) - 'a'.charCodeAt(0);
        const eY = parseInt(end[1]) - 1;

        // If start and end are the same, no moves needed
        if (start === end) {
            return true;
        }

        // If no moves allowed but positions are different
        if (n === 0) {
            return false;
        }

        // Check if positions are on the same diagonal
        if (this.sameDiagonal(sX, sY, eX, eY)) {
            return n >= 1;
        }

        // For all other cases, we need at least 2 moves
        // and the number of moves must be sufficient
        return n >= 2;
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }
}

module.exports = { Solution };