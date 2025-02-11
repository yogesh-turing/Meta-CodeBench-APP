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
        let maxInvited = 0;

        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                const invited = EmployeeInvitation.dfs(favorite, visited, recursionStack, i);
                maxInvited = Math.max(maxInvited, invited);
            }
        }

        return maxInvited;
    }

    static dfs(favorite, visited, recursionStack, employee) {
        visited[employee] = true;
        recursionStack[employee] = true;

        const nextEmployee = favorite[employee];
        if (nextEmployee === employee) {
            // Self-loop, count as one invitation
            return 1;
        } else if (recursionStack[nextEmployee]) {
            // Cycle detected, count all employees in the cycle
            let cycleInvited = 0;
            let current = employee;
            while (true) {
                cycleInvited++;
                visited[current] = false; // Reset visited to explore other paths
                current = favorite[current];
                if (current === employee) {
                    break;
                }
            }
            return cycleInvited;
        } else if (visited[nextEmployee]) {
            // Already visited, no need to explore further
            return 1;
        } else {
            // Recursively explore the next employee
            const invited = EmployeeInvitation.dfs(favorite, visited, recursionStack, nextEmployee);
            return invited + 1; // Count the current employee
        }
    }
}

// Test the function with a sample input
const favorite = [1, 2, 0, 4, 5, 3];
console.log(EmployeeInvitation.maxEmployeesInvited(favorite));

module.exports = {EmployeeInvitation};