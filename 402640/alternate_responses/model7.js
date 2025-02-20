class Solution {
    static isReacheable(start, end, n) {
        // Validate inputs
        if (typeof start !== 'string' || typeof end !== 'string') {
            throw new Error('Start and end positions must be strings');
        }
        if (start.length !== 2 || end.length !== 2) {
            throw new Error('Start and end positions must be in the format "a1"');
        }
        if (isNaN(n) || n < 0) {
            throw new Error('Maximum moves must be a non-negative integer');
        }

        // Convert positions to coordinates
        const startCoords = this.positionToCoords(start);
        const endCoords = this.positionToCoords(end);

        // Check if start and end positions are the same
        if (startCoords[0] === endCoords[0] && startCoords[1] === endCoords[1]) {
            return true;
        }

        // Check if the target position is reachable
        if (this.sameDiagonal(startCoords[0], startCoords[1], endCoords[0], endCoords[1])) {
            // Calculate the number of diagonal moves needed
            const movesNeeded = Math.abs(startCoords[0] - endCoords[0]);
            return movesNeeded <= n;
        } else {
            // If the target position is not on the same diagonal, it's not reachable
            return false;
        }
    }

    static sameDiagonal(sX, sY, eX, eY) {
        return (Math.abs(sX - sY) === Math.abs(eX - eY)) || (sX + sY === eX + eY);
    }

    static positionToCoords(position) {
        // Convert the position string to coordinates
        const letter = position[0];
        const number = parseInt(position[1]);
        const x = letter.charCodeAt(0) - 'a'.charCodeAt(0);
        const y = number - 1;
        return [x, y];
    }
}

module.exports = { Solution };