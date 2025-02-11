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
        const inDegree = new Array(n).fill(0);
        const graph = new Array(n).fill(0).map(() => []);

        // Build graph and update in-degrees
        for (let i = 0; i < n; i++) {
            graph[i].push(favorite[i]);
            inDegree[favorite[i]]++;
        }

        // Initialize queue with nodes having in-degree 0
        const queue = [];
        for (let i = 0; i < n; i++) {
            if (inDegree[i] === 0) {
                queue.push(i);
            }
        }

        let maxInvited = 0;
        while (queue.length > 0) {
            const node = queue.shift();
            maxInvited++;

            // Decrease in-degree of neighboring nodes
            for (const neighbor of graph[node]) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            }
        }

        // Handle remaining nodes (cycles)
        for (let i = 0; i < n; i++) {
            if (inDegree[i] !== 0) {
                // Perform DFS to detect and handle cycles
                const visited = new Set();
                const stack = [i];
                let cycleLength = 0;

                while (stack.length > 0) {
                    const node = stack.pop();
                    if (visited.has(node)) {
                        // Cycle detected, update maxInvited if necessary
                        if (cycleLength > maxInvited) {
                            maxInvited = cycleLength;
                        }
                        break;
                    }

                    visited.add(node);
                    cycleLength++;

                    for (const neighbor of graph[node]) {
                        stack.push(neighbor);
                    }
                }
            }
        }

        return maxInvited;
    }
}

// Test the function with a sample input
const favorite = [1, 2, 0, 4, 5, 3];
console.log(EmployeeInvitation.maxEmployeesInvited(favorite));

module.exports = {EmployeeInvitation};