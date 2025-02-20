class Solution {
    static isReacheable(start, end, n) {
        // Input validation
        if (!start || !end || typeof start !== 'string' || typeof end !== 'string' ||
            start.length !== 2 || end.length !== 2 || !Number.isInteger(n) || n < 0) {
            throw new Error("Invalid input parameters");
        }

        // Validate grid positions
        const validColumns = 'abcdefgh';
        const validRows = '12345678';
        
        if (!validColumns.includes(start[0].toLowerCase()) || !validRows.includes(start[1]) ||
            !validColumns.includes(end[0].toLowerCase()) || !validRows.includes(end[1])) {
            throw new Error("Invalid grid positions");
        }

        // If start and end are same position
        if (start === end) return true;

        // Convert chess notation to coordinates
        const startX = validColumns.indexOf(start[0].toLowerCase());
        const startY = parseInt(start[1]) - 1;
        const endX = validColumns.indexOf(end[0].toLowerCase());
        const endY = parseInt(end[1]) - 1;

        // If not enough moves
        if (n === 0) return false;

        // Check if positions are on same diagonal
        if (this.sameDiagonal(startX, startY, endX, endY)) {
            return n >= 1;
        }

        // If positions are not on same diagonal, need at least 2 moves
        // and must be reachable within n moves
        return n >= 2;
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }
}

module.exports = { Solution };