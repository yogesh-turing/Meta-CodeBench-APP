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
        // Initialize a visited array to keep track of visited employees
        const visited = new Array(favorite.length).fill(false);
        // Initialize a recursion stack to detect cycles
        const recursionStack = new Array(favorite.length).fill(false);
        // Initialize a variable to store the maximum depth (longest chain)
        let maxDepth = 0;

        // Perform DFS for each unvisited employee
        for (let i = 0; i < favorite.length; i++) {
            if (!visited[i]) {
                // Recursively explore the invitation chain starting from the current employee
                maxDepth = Math.max(maxDepth, this.exploreChain(i, favorite, visited, recursionStack));
            }
        }

        // The maximum number of employees that can be invited is the longest chain
        return maxDepth;
    }

    // Helper function to explore the invitation chain using DFS
    static exploreChain(employee, favorite, visited, recursionStack) {
        // Mark the current employee as visited and add it to the recursion stack
        visited[employee] = true;
        recursionStack[employee] = true;

        // Get the next employee in the chain (favorite colleague)
        const nextEmployee = favorite[employee];

        // If the next employee is not visited, continue exploring the chain
        if (!visited[nextEmployee]) {
            return 1 + this.exploreChain(nextEmployee, favorite, visited, recursionStack);
        }
        // If the next employee is in the recursion stack, it's a cycle
        else if (recursionStack[nextEmployee]) {
            // If it's a 2-cycle, consider it as a valid chain of length 2
            if (nextEmployee === favorite[nextEmployee]) {
                return 2;
            }
            // For other cycles, do not include the cycle itself but include dependent chains
            else {
                return 1;
            }
        }
        // If the next employee is visited but not in the recursion stack, it's not a cycle
        else {
            return 1;
        }
    }
}

// Test the function with a sample input
const favorite = [1, 2, 0, 4, 5, 3];
console.log(EmployeeInvitation.maxEmployeesInvited(favorite));

module.exports = {EmployeeInvitation};