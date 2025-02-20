class WirelessChannelAllocator {
    /**
     * Finds the minimum number of channels required such that no two
     * interfering access points share the same channel.
     *
     * @param {boolean[][]} interferenceMatrix - A square boolean matrix
     * @returns {number} The minimum number of channels, or -1.
     */
    static minChannels(interferenceMatrix) {
        const n = interferenceMatrix.length;
        const colors = new Array(n).fill(1);

        for (let channels = 0; channels <= n; channels++) {
            colors.fill(1);
            if (this.colorGraph(interferenceMatrix, colors, channels, 0)) {
                return channels;
            }
        }

        return n + 1;
    }

    /**
     * Recursive utility that attempts to color the graph (starting at vertex 'vertex')
     * using up to 'maxChannels' colors. If it succeeds, returns true; else false.
     *
     * @param {boolean[][]} matrix - The interference (adjacency) matrix
     * @param {number[]} colors - Current assignment of channels to vertices
     * @param {number} maxChannels - The maximum number of channels we can use
     * @param {number} vertex - The current vertex to color
     * @returns {boolean} True if the graph can be colored up to this vertex
     */
    static colorGraph(matrix, colors, maxChannels, vertex) {
        if (vertex === matrix.length) {
            return true;
        }

        for (let channel = 1; channel <= maxChannels; channel++) {
            if (this.isSafe(matrix, colors, vertex, channel)) {
                colors[vertex] = channel;
                if (this.colorGraph(matrix, colors, maxChannels, vertex + 1)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Checks if it's safe to assign a channel to a vertex.
     *
     * @param {boolean[][]} matrix - The interference matrix
     * @param {number[]} colors - Current assignment of channels
     * @param {number} vertex - The vertex we're trying to color
     * @param {number} channel - The candidate channel
     * @returns {boolean} True if it's safe to assign 'channel' to 'vertex'
     */
    static isSafe(matrix, colors, vertex, channel) {
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[vertex][i] && colors[i] === channel) {
                return false;
            }
        }
        return true;
    }
}

module.exports = {WirelessChannelAllocator};