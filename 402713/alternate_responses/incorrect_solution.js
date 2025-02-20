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
      const n = interferenceMatrix.length;
      const colors = new Array(n).fill(0); // Initialize all colors to 0
  
      for (let channels = 1; channels <= n; channels++) {
        if (WirelessChannelAllocator.colorGraph(interferenceMatrix, colors, channels, 0)) {
          return channels;
        }
      }
  
      return -1; // No solution found
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
      if (vertex === matrix.length) {
        return true; // All vertices colored successfully
      }
  
      for (let channel = 1; channel <= maxChannels; channel++) {
        if (WirelessChannelAllocator.isSafe(matrix, colors, vertex, channel)) {
          colors[vertex] = channel;
          if (WirelessChannelAllocator.colorGraph(matrix, colors, maxChannels, vertex + 1)) {
            return true;
          }
          colors[vertex] = 0; // Backtrack
        }
      }
  
      return false; // No safe channel found
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
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[vertex][i] && colors[i] === channel) {
          return false; // Interfering vertex already has this channel
        }
      }
      return true;
    }
  }
  
  module.exports = {WirelessChannelAllocator};