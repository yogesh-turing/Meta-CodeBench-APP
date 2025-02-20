class Solution {
    static isReacheable(start, end, n) {
        // Validate the inputs
        if (!this.isValidPosition(start)) {
            throw new Error('Invalid start position');
        }
        if (!this.isValidPosition(end)) {
            throw new Error('Invalid end position');
        }
        if (n < 0) {
            throw new Error('Invalid number of moves');
        }

        // Convert the start and end positions to coordinates
        const startCoords = this.positionToCoordinates(start);
        const endCoords = this.positionToCoordinates(end);

        // Calculate the number of diagonal moves required to reach the target position
        const movesRequired = Math.max(Math.abs(startCoords[0] - endCoords[0]), Math.abs(startCoords[1] - endCoords[1]));

        // Check if the target position can be reached within the given maximum number of moves
        return movesRequired <= n;
    }

    static positionToCoordinates(position) {
        // Convert a position string (e.g., "a1") to coordinates (e.g., [0, 0])
        const letter = position[0];
        const number = parseInt(position[1]);
        return [letter.charCodeAt(0) - 97, number - 1];
    }

    static isValidPosition(position) {
        // Check if a position string is valid (e.g., "a1" to "h8")
        const letter = position[0];
        const number = parseInt(position[1]);
        return letter >= 'a' && letter <= 'h' && number >= 1 && number <= 8;
    }
}

module.exports = { Solution };