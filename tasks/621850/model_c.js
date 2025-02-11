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
        const currentPath = new Set();
        const cycles = [];
        const twoCycles = new Set();
        
        // Find all cycles in the graph
        function findCycles(node, path = []) {
            if (currentPath.has(node)) {
                const cycleStart = path.indexOf(node);
                cycles.push(path.slice(cycleStart));
                return;
            }
            
            if (visited.has(node)) return;
            
            visited.add(node);
            currentPath.add(node);
            path.push(node);
            
            findCycles(favorite[node], path);
            
            path.pop();
            currentPath.delete(node);
        }
        
        // Find all cycles
        for (let i = 0; i < n; i++) {
            if (!visited.has(i)) {
                findCycles(i);
            }
        }
        
        // Identify 2-person cycles
        for (const cycle of cycles) {
            if (cycle.length === 2) {
                twoCycles.add(cycle[0]);
                twoCycles.add(cycle[1]);
            }
        }
        
        // Calculate longest chain ending at each node
        function getLongestChain(node, visited = new Set()) {
            if (visited.has(node)) return 0;
            if (twoCycles.has(node)) return 0;
            
            visited.add(node);
            let maxLength = 0;
            
            // Find all nodes that have this node as their favorite
            for (let i = 0; i < n; i++) {
                if (favorite[i] === node) {
                    maxLength = Math.max(maxLength, getLongestChain(i, visited));
                }
            }
            
            visited.delete(node);
            return maxLength + 1;
        }
        
        let maxChainLength = 0;
        let totalFromTwoCycles = twoCycles.size;
        
        // Calculate longest chains attached to 2-cycles
        for (const node of twoCycles) {
            for (let i = 0; i < n; i++) {
                if (favorite[i] === node && !twoCycles.has(i)) {
                    maxChainLength = Math.max(maxChainLength, getLongestChain(i));
                }
            }
        }
        
        // Calculate longest independent chains
        for (let i = 0; i < n; i++) {
            if (!twoCycles.has(i)) {
                maxChainLength = Math.max(maxChainLength, getLongestChain(i));
            }
        }
        
        return totalFromTwoCycles + maxChainLength;
    }
}

module.exports = {EmployeeInvitation};