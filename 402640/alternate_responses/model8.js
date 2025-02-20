class Solution {
    static isReacheable(start, end, n) {
        // Validate inputs
        if (!start || !end || start.length !== 2 || end.length !== 2) {
            throw new Error('Invalid start or end position');
        }
        if (isNaN(n) || n < 0) {
            throw new Error('Invalid number of moves');
        }

        // Convert positions to coordinates
        const sX = start.charCodeAt(0) - 97;
        const sY = parseInt(start[1]) - 1;
        const eX = end.charCodeAt(0) - 97;
        const eY = parseInt(end[1]) - 1;

        // Check if positions are within grid
        if (sX < 0 || sX > 7 || sY < 0 || sY > 7 || eX < 0 || eX > 7 || eY < 0 || eY > 7) {
            throw new Error('Positions out of grid');
        }

        // Check if robot is already at target
        if (sX === eX && sY === eY) {
            return true;
        }

        // Check if target is reachable in n moves
        return Solution.sameDiagonal(sX, sY, eX, eY) && Math.abs(sX - eX) <= n;
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }
}

module.exports = { Solution };