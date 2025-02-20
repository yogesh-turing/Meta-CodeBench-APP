class Solution {
    static isReacheable(start, end, n) {
        // Input validation
        if (typeof start !== 'string' || typeof end !== 'string' || start.length !== 2 || end.length !== 2) {
            throw new Error('Invalid position format. Positions should be strings of length 2.');
        }
        
        if (n < 0) {
            throw new Error('Invalid number of moves. Number of moves should be non-negative.');
        }

        // Convert start and end positions to coordinates
        const startX = start.charCodeAt(0) - 'a'.charCodeAt(0);
        const startY = parseInt(start[1]) - 1;
        const endX = end.charCodeAt(0) - 'a'.charCodeAt(0);
        const endY = parseInt(end[1]) - 1;

        // Check if positions are within the grid
        if (startX < 0 || startX >= 8 || startY < 0 || startY >= 8 || endX < 0 || endX >= 8 || endY < 0 || endY >= 8) {
            throw new Error('Invalid position. Positions should be within the 8x8 grid.');
        }

        // Calculate the minimum number of diagonal moves required to reach the target
        const minMoves = Math.max(Math.abs(startX - endX), Math.abs(startY - endY));

        // Check if the target can be reached within the given number of moves
        return minMoves <= n;
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }
}

module.exports = { Solution };