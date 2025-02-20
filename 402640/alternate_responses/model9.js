class Solution {
    static isReacheable(start, end, n) {
        // Convert positions to coordinates
        let sX = start.charCodeAt(0) - 'a'.charCodeAt(0);
        let sY = start.charCodeAt(1) - '1'.charCodeAt(0);
        let eX = end.charCodeAt(0) - 'a'.charCodeAt(0);
        let eY = end.charCodeAt(1) - '1'.charCodeAt(0);

        // Validate inputs
        if (sX < 0 || sX > 7 || sY < 0 || sY > 7 || eX < 0 || eX > 7 || eY < 0 || eY > 7 || n < 0) {
            throw new Error("Invalid input");
        }

        // Check if start and end are the same
        if (sX === eX && sY === eY) {
            return true;
        }

        // Check if start and end are on the same diagonal
        if (Solution.sameDiagonal(sX, sY, eX, eY)) {
            return true;
        }

        // Calculate minimum number of moves
        let moves = Math.max(Math.abs(sX - eX), Math.abs(sY - eY));

        // Check if moves is within the limit
        return moves <= n;
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }
}

module.exports = { Solution };