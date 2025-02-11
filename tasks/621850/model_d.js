class EmployeeInvitation {
    /**
     * Determines the maximum number of employees that can be invited to an event,
     * considering relationships where employees invite their favorite colleagues.
     * 
     * @param {number[]} favorite - An array where each index represents an employee,
     *                               and the value at that index represents the employee's 
     *                               favorite colleague to invite.
     * @returns {number} - Maximum number of employees that can be invited.
     */
    static maxEmployeesInvited(favorite) {
        const n = favorite.length;
        const visited = new Array(n).fill(false);
        const inStack = new Array(n).fill(false);
        const cycles = [];
        const dp = new Array(n).fill(0);

        // Find cycles using DFS
        function findCycle(node, path = []) {
            if (inStack[node]) {
                const cycleStart = path.indexOf(node);
                cycles.push(path.slice(cycleStart));
                return;
            }
            if (visited[node]) return;

            visited[node] = true;
            inStack[node] = true;
            path.push(node);

            findCycle(favorite[node], path);

            inStack[node] = false;
            path.pop();
        }

        // Find longest chain ending at node
        function getLongestChain(node, cycleNodes) {
            if (dp[node] !== 0 || cycleNodes.has(node)) return dp[node];
            dp[node] = 1 + getLongestChain(favorite[node], cycleNodes);
            return dp[node];
        }

        // Find all cycles
        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                findCycle(i);
            }
        }

        // Process cycles and chains
        let maxInvites = 0;
        const cycleNodes = new Set();

        // Handle cycles
        for (const cycle of cycles) {
            if (cycle.length === 2) {
                // For 2-cycles, include the cycle and longest chains leading to each node
                let chainSum = 0;
                for (const node of cycle) {
                    cycleNodes.add(node);
                    // Find nodes that point to this cycle node
                    for (let i = 0; i < n; i++) {
                        if (!cycleNodes.has(i) && favorite[i] === node) {
                            chainSum += getLongestChain(i, cycleNodes);
                        }
                    }
                }
                maxInvites += cycle.length + chainSum;
            } else if (cycle.length > 2) {
                // For larger cycles, just include the cycle itself
                cycle.forEach(node => cycleNodes.add(node));
                maxInvites = Math.max(maxInvites, cycle.length);
            }
        }

        // Handle remaining chains
        for (let i = 0; i < n; i++) {
            if (!cycleNodes.has(i)) {
                dp[i] = getLongestChain(i, cycleNodes);
                maxInvites = Math.max(maxInvites, dp[i]);
            }
        }

        return maxInvites;
    }
}

module.exports = {EmployeeInvitation};