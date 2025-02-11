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
        const chainLengths = new Map();

        // Find all cycles and calculate chain lengths
        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                this.findCycles(i, favorite, visited, inStack, [], cycles);
            }
        }

        // Calculate maximum chain length ending at each node
        const calculateChainLength = (node, favorite, memo = new Map(), visited = new Set()) => {
            if (visited.has(node)) return 0;
            if (memo.has(node)) return memo.get(node);

            visited.add(node);
            const length = 1 + calculateChainLength(favorite[node], favorite, memo, visited);
            memo.set(node, length);
            return length;
        };

        let maxInvitations = 0;
        let twoCyclesTotal = 0;
        let maxChainLength = 0;

        // Process all cycles
        for (const cycle of cycles) {
            if (cycle.length === 2) {
                // For 2-cycles, calculate chains that can be attached to them
                let cycleWithChains = cycle.length;
                for (const node of cycle) {
                    // Find longest chain ending at this cycle node
                    let maxAttachedChain = 0;
                    for (let i = 0; i < n; i++) {
                        if (!cycle.includes(i) && favorite[i] === node) {
                            maxAttachedChain = Math.max(maxAttachedChain, 
                                calculateChainLength(i, favorite, new Map(), new Set()));
                        }
                    }
                    cycleWithChains += maxAttachedChain;
                }
                twoCyclesTotal += cycleWithChains;
            } else {
                // For longer cycles, just count the cycle length
                maxChainLength = Math.max(maxChainLength, cycle.length);
            }
        }

        // Find longest chain not part of any cycle
        for (let i = 0; i < n; i++) {
            if (!inStack[i]) {
                maxChainLength = Math.max(maxChainLength, 
                    calculateChainLength(i, favorite, new Map(), new Set()));
            }
        }

        // Return maximum of either all 2-cycles with their chains or the longest single chain/cycle
        return Math.max(twoCyclesTotal, maxChainLength);
    }

    static findCycles(node, favorite, visited, inStack, currentPath, cycles) {
        if (inStack[node]) {
            const cycleStart = currentPath.indexOf(node);
            if (cycleStart !== -1) {
                cycles.push(currentPath.slice(cycleStart));
            }
            return;
        }

        if (visited[node]) return;

        visited[node] = true;
        inStack[node] = true;
        currentPath.push(node);

        this.findCycles(favorite[node], favorite, visited, inStack, currentPath, cycles);

        currentPath.pop();
        inStack[node] = false;
    }
}

module.exports = {EmployeeInvitation};