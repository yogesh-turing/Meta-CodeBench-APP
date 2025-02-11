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
        // Initialize variables to track visited employees and the longest chain
        const visited = new Array(favorite.length).fill(false);
        const longestChain = { length: 0 };

        // Perform DFS for each unvisited employee
        for (let employee = 0; employee < favorite.length; employee++) {
            if (!visited[employee]) {
                // Initialize variables for the current DFS path
                const currentPath = new Set();
                const depth = { value: 0 };

                // Perform DFS starting from the current employee
                EmployeeInvitation.dfs(favorite, employee, visited, currentPath, depth, longestChain);
            }
        }

        // Return the maximum number of employees that can be invited
        return longestChain.length;
    }

    // Helper function to perform DFS
    static dfs(favorite, employee, visited, currentPath, depth, longestChain) {
        // Mark the current employee as visited and add them to the current path
        visited[employee] = true;
        currentPath.add(employee);

        // Update the current depth
        depth.value++;

        // Get the favorite colleague of the current employee
        const favoriteColleague = favorite[employee];

        // Check if the favorite colleague is already in the current path (cycle detected)
        if (currentPath.has(favoriteColleague)) {
            // If it's a 2-cycle, consider it valid and update the longest chain if necessary
            if (currentPath.size === 2 && depth.value > longestChain.length) {
                longestChain.length = depth.value;
            }
        } else if (!visited[favoriteColleague]) {
            // If the favorite colleague is not visited, continue DFS from there
            EmployeeInvitation.dfs(favorite, favoriteColleague, visited, currentPath, depth, longestChain);
        }

        // Backtrack: remove the current employee from the current path and decrease the depth
        currentPath.delete(employee);
        depth.value--;

        // Update the longest chain if the current depth is greater
        if (depth.value > longestChain.length) {
            longestChain.length = depth.value;
        }
    }
}

// Test the function with a sample input
const favorite = [1, 2, 0, 4, 5, 3];
console.log(EmployeeInvitation.maxEmployeesInvited(favorite));

module.exports = {EmployeeInvitation};