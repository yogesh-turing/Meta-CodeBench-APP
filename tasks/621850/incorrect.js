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
        const depth = new Array(n).fill(0);

        let maxEmployees = 0;
        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                maxEmployees = Math.max(maxEmployees, this.dfs(favorite, visited, depth, i));
            }
        }

        return maxEmployees;
    }

    static dfs(favorite, visited, depth, employee) {
        if (visited[employee]) {
            return depth[employee] === 0 ? 2 : 0;
        }

        visited[employee] = true;
        const nextEmployee = favorite[employee];
        const nextDepth = this.dfs(favorite, visited, depth, nextEmployee);
        depth[employee] = nextDepth + 1;

        return depth[employee];
    }
}

// Test the function with a sample input
const favorite = [1, 2, 0, 4, 5, 3];
console.log(EmployeeInvitation.maxEmployeesInvited(favorite));

module.exports = {EmployeeInvitation};
