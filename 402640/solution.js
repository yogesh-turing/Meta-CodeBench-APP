class Solution {
  static isReacheable(start, end, n) {
    // Input validation
    if (!start || !end || !this.isValidPosition(start) || !this.isValidPosition(end)) {
      throw new Error("Invalid position format. Must be between a1 and h8.");
    }
    if (n < 0) {
      throw new Error("Number of moves cannot be negative.");
    }

    // If start and end are the same, no movement is required.
    if (start === end) {
      return true;
    }

    // If no moves allowed but positions differ, it's not reachable.
    if (n === 0) {
      return false;
    }

    const sX = start.charCodeAt(0) - 97; // Convert column letter to 0-based index
    const sY = parseInt(start[1], 10) - 1; // Convert row to 0-based index
    const eX = end.charCodeAt(0) - 97;
    const eY = parseInt(end[1], 10) - 1;

    // Determine the parity of the diagonals for start and end.
    const sDiagonal = (sX + sY) % 2 === 0;
    const eDiagonal = (eX + eY) % 2 === 0;

    // If they are on different parity squares, target is unreachable.
    if (sDiagonal !== eDiagonal) {
      return false;
    } else if (n === 1) {
      // If only one move is allowed, check if the target lies on a direct diagonal.
      return this.sameDiagonal(sX, sY, eX, eY);
    } else {
      // For 2 or more moves on same-parity squares, target is always reachable.
      return true;
    }
  }


  static isValidPosition(position) {
    if (position.length !== 2) {
      return false;
    }

    const col = position[0];
    const row = position[1];

    return col >= 'a' && col <= 'h' && row >= '1' && row <= '8';
  }

  static sameDiagonal(sX, sY, eX, eY) {
    return Math.abs(sX - sY) === Math.abs(eX - eY) || sX + sY === eX + eY;
  }
}

// Export the Solution class for use in tests or other modules.
module.exports = {Solution};