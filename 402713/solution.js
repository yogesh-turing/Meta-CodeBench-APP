class WirelessChannelAllocator {
  /**
   * Finds the minimum number of channels required such that no two
   * interfering access points share the same channel.
   *
   * @param {boolean[][]} interferenceMatrix - A square boolean matrix where
   *                                           interferenceMatrix[i][j] = true
   *                                           indicates that AP i and AP j interfere
   * @returns {number} - The minimum number of channels (>= 1),
   *                     or -1 if the matrix is invalid or empty
   */
  static minChannels(interferenceMatrix) {
    // Validate input
    if (!interferenceMatrix || interferenceMatrix.length === 0) {
      return -1; // No data or invalid
    }
    const n = interferenceMatrix.length;
    for (const row of interferenceMatrix) {
      if (row.length !== n) {
        return -1; // Not a square matrix
      }
    }
    const colors = new Array(n).fill(0);

    for (let maxChannels = 1; maxChannels <= n; maxChannels++) {
      // Use backtracking to check if we can color the entire graph
      if (WirelessChannelAllocator.colorGraph(interferenceMatrix, colors, maxChannels, 0)) {
        return maxChannels;
      }
    }

    // Should never get here for a well-formed adjacency matrix,
    // since coloring with n colors is always possible.
    return -1;
  }

  /**
   * Recursive utility that attempts to color the graph (starting at vertex 'vertex')
   * using up to 'maxChannels' colors. If it succeeds, returns true; else false.
   *
   * @param {boolean[][]} matrix - The interference (adjacency) matrix
   * @param {number[]} colors - Current assignment of channels to vertices
   * @param {number} maxChannels - The maximum number of channels we can use
   * @param {number} vertex - The current vertex to color
   * @returns {boolean} - True if the graph can be colored up to this vertex, false otherwise
   */
  static colorGraph(matrix, colors, maxChannels, vertex) {
    const n = matrix.length;

    // Base case: all vertices are assigned
    if (vertex === n) {
      return true;
    }

    // Try assigning each color from 1..maxChannels to this vertex
    for (let channel = 1; channel <= maxChannels; channel++) {
      if (WirelessChannelAllocator.isSafe(matrix, colors, vertex, channel)) {
        colors[vertex] = channel;

        // Recur for the next vertex
        if (WirelessChannelAllocator.colorGraph(matrix, colors, maxChannels, vertex + 1)) {
          return true;
        }

        // Backtrack
        colors[vertex] = 0;
      }
    }

    // If no channel can be assigned to this vertex, return false
    return false;
  }

  /**
   * Checks if assigning the given 'channel' to 'vertex' does not
   * conflict with already-colored interfering neighbors.
   *
   * @param {boolean[][]} matrix - The interference matrix
   * @param {number[]} colors - Current assignment of channels
   * @param {number} vertex - The vertex we're trying to color
   * @param {number} channel - The candidate channel
   * @returns {boolean} - True if it's safe to assign 'channel' to 'vertex', false otherwise
   */
  static isSafe(matrix, colors, vertex, channel) {
    // Check all vertices that could interfere with 'vertex'
    for (let i = 0; i < matrix.length; i++) {
      // If there's interference and the neighbor is already colored with the same channel
      if (matrix[vertex][i] && colors[i] === channel) {
        return false;
      }
    }
    return true;
  }
}

module.exports = {WirelessChannelAllocator};