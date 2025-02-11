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
        const numEmployees = favorite.length;
        const depth = new Array(numEmployees).fill(0);
        const visited = new Array(numEmployees).fill(false);
        const inCycle = new Array(numEmployees).fill(false);
        let maxDepth = 0;

        for (let i = 0; i < numEmployees; i++) {
            if (!visited[i]) {
                const stack = [];
                const path = new Set();
                stack.push(i);
                path.add(i);

                while (stack.length) {
                    const node = stack[stack.length - 1];
                    const next = favorite[node];

                    if (path.has(next)) {
                        maxDepth = Math.max(maxDepth, path.size);
                        path.forEach(n => inCycle[n] = true);
                        break;
                    }

                    stack.push(next);
                    path.add(next);
                }

                const currentDepth = path.size;
                path.forEach(n => {
                    visited[n] = true;
                    depth[n] = currentDepth;
                });
            }
        }

        for (let i = 0; i < numEmployees; i++) {
            if (!inCycle[i]) {
                maxDepth = Math.max(maxDepth, depth[i]);
            }
        }

        return maxDepth;
    }
}

// Test the function with a sample input
const favorite = [1, 2, 0, 4, 5, 3];
console.log(EmployeeInvitation.maxEmployeesInvited(favorite));

module.exports = {EmployeeInvitation};
