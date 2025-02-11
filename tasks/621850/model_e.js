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
        const visited = new Set();
        const inStack = new Set();
        const cycles = [];
        
        // Find all cycles in the graph
        function findCycle(node, path = []) {
            if (inStack.has(node)) {
                const cycleStart = path.indexOf(node);
                cycles.push(path.slice(cycleStart));
                return;
            }
            
            if (visited.has(node)) return;
            
            visited.add(node);
            inStack.add(node);
            path.push(node);
            
            findCycle(favorite[node], path);
            
            inStack.delete(node);
            path.pop();
        }
        
        // Find the length of the longest chain ending at node
        function findLongestChain(node, chainVisited = new Set()) {
            if (chainVisited.has(node)) return 0;
            
            chainVisited.add(node);
            let maxLength = 0;
            
            // Find employees who have this node as their favorite
            for (let i = 0; i < n; i++) {
                if (favorite[i] === node && !inCycle.has(i)) {
                    maxLength = Math.max(maxLength, findLongestChain(i, chainVisited));
                }
            }
            
            chainVisited.delete(node);
            return maxLength + 1;
        }
        
        // Find all cycles
        for (let i = 0; i < n; i++) {
            if (!visited.has(i)) {
                findCycle(i);
            }
        }
        
        // Mark all nodes that are part of any cycle
        const inCycle = new Set();
        cycles.forEach(cycle => {
            cycle.forEach(node => inCycle.add(node));
        });
        
        let maxInvites = 0;
        let twoCyclesCount = 0;
        
        // Process cycles
        cycles.forEach(cycle => {
            if (cycle.length === 2) {
                // For 2-cycles, add chains from both nodes
                twoCyclesCount += 2;
                let chainSum = 0;
                cycle.forEach(node => {
                    chainSum += Math.max(0, ...Array.from({length: n}, (_, i) => 
                        favorite[i] === node && !inCycle.has(i) ? findLongestChain(i) : 0
                    ));
                });
                maxInvites = Math.max(maxInvites, twoCyclesCount + chainSum);
            } else if (cycle.length > 2) {
                // For larger cycles, just count the cycle length
                maxInvites = Math.max(maxInvites, cycle.length);
            }
        });
        
        // If no 2-cycles found, find the longest possible chain
        if (twoCyclesCount === 0) {
            for (let i = 0; i < n; i++) {
                if (!inCycle.has(i)) {
                    maxInvites = Math.max(maxInvites, findLongestChain(i));
                }
            }
        }
        
        return maxInvites;
    }
}

module.exports = {EmployeeInvitation};