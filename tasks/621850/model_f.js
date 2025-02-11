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
        const recursionStack = new Array(n).fill(false);
        const longestChain = new Array(n).fill(0);
        let maxInvited = 0;

        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                maxInvited = Math.max(maxInvited, this.dfs(favorite, visited, recursionStack, longestChain, i));
            }
        }

        return maxInvited;
    }

    static dfs(favorite, visited, recursionStack, longestChain, employee) {
        visited[employee] = true;
        recursionStack[employee] = true;

        const nextEmployee = favorite[employee];
        if (nextEmployee === employee) {
            // Self-loop, treat as a single employee
            return 1;
        }

        if (recursionStack[nextEmployee]) {
            // Cycle detected, check if it's a 2-cycle
            if (favorite[nextEmployee] === employee) {
                // 2-cycle, include both employees in the chain
                return 2;
            } else {
                // Invalid cycle, return 0 to exclude from the longest chain
                return 0;
            }
        }

        if (!visited[nextEmployee]) {
            // Recursively explore the next employee's chain
            longestChain[employee] = 1 + this.dfs(favorite, visited, recursionStack, longestChain, nextEmployee);
        } else {
            // Next employee's chain has already been explored, use the cached result
            longestChain[employee] = 1 + longestChain[nextEmployee];
        }

        recursionStack[employee] = false;
        return longestChain[employee];
    }
}

// Test the function with a sample input
const favorite = [1, 2, 0, 4, 5, 3];
console.log(EmployeeInvitation.maxEmployeesInvited(favorite));

module.exports = {EmployeeInvitation};