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
        const twoCycles = new Set();

        // Find all cycles in the graph
        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                this.findCycles(i, favorite, visited, inStack, [], cycles);
            }
        }

        // Identify 2-person cycles
        for (const cycle of cycles) {
            if (cycle.length === 2) {
                twoCycles.add(cycle[0]);
                twoCycles.add(cycle[1]);
            }
        }

        // Find longest chain ending at each node in 2-person cycles
        const chainLengths = new Map();
        visited.fill(false);
        let maxChainSum = 0;
        let maxCycleLength = 0;

        // Process 2-person cycles and their chains
        if (twoCycles.size > 0) {
            for (let i = 0; i < n; i++) {
                if (!twoCycles.has(i)) {
                    const length = this.findLongestChain(i, favorite, visited, twoCycles);
                    if (length > 0) {
                        chainLengths.set(i, length);
                    }
                }
            }

            // Calculate sum of 2-cycles and their longest chains
            let twoCycleResult = twoCycles.size;
            for (const length of chainLengths.values()) {
                twoCycleResult += length;
            }
            maxChainSum = twoCycleResult;
        }

        // Find the largest cycle
        for (const cycle of cycles) {
            if (cycle.length > maxCycleLength) {
                maxCycleLength = cycle.length;
            }
        }

        return Math.max(maxChainSum, maxCycleLength);
    }

    static findCycles(current, favorite, visited, inStack, path, cycles) {
        if (inStack[current]) {
            const cycleStart = path.indexOf(current);
            if (cycleStart !== -1) {
                cycles.push(path.slice(cycleStart));
            }
            return;
        }

        if (visited[current]) {
            return;
        }

        visited[current] = true;
        inStack[current] = true;
        path.push(current);

        const next = favorite[current];
        this.findCycles(next, favorite, visited, inStack, path, cycles);

        path.pop();
        inStack[current] = false;
    }

    static findLongestChain(current, favorite, visited, twoCycles) {
        if (visited[current]) return 0;
        if (twoCycles.has(current)) return 1;

        visited[current] = true;
        const length = this.findLongestChain(favorite[current], favorite, visited, twoCycles);
        visited[current] = false;

        return length === 0 ? 0 : length + 1;
    }
}

module.exports = {EmployeeInvitation};