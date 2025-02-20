class Solution {

  static isReacheable(start, end, n) {
    // Input validation
    if (
      !start ||
      !end ||
      start.length !== 2 ||
      end.length !== 2 ||
      n < 0
    ) {
      throw new Error("Invalid input parameters");
    }

    // Validate chess notation
    if (!this.isValidPosition(start) || !this.isValidPosition(end)) {
      throw new Error("Invalid chess position");
    }

    // Convert chess notation to coordinates (0-based)
    const startX = start.charCodeAt(0) - 'a'.charCodeAt(0);
    const startY = start.charCodeAt(1) - '1'.charCodeAt(0);
    const endX = end.charCodeAt(0) - 'a'.charCodeAt(0);
    const endY = end.charCodeAt(1) - '1'.charCodeAt(0);

    // If start and end are the same position
    if (start === end) {
      return true;
    }

    // If no moves allowed but positions are different
    if (n === 0) {
      return false;
    }

    // If positions are on the same diagonal, we need only 1 move
    if (this.sameDiagonal(startX, startY, endX, endY)) {
      return true;
    }

    // If we have more than 1 move available, we can reach any position
    // Because we can always reach any square in 2 moves
    return n >= 2;
  }

 
  static sameDiagonal(sX, sY, eX, eY) {
    return (
      Math.abs(sX - sY) === Math.abs(eX - eY) ||
      sX + sY === eX + eY
    );
  }

 
  static isValidPosition(position) {
    const file = position[0];
    const rank = position[1];
    return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
  }
}

// Export the Solution class for usage in other modules or testing.
module.exports = {Solution};