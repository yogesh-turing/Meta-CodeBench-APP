function getMaxSumPath(grid) {
    // Input validations
    if (!grid || !Array.isArray(grid) || grid.length !== 3 || 
        !grid.every(row => Array.isArray(row) && row.length === 3)) {
        throw new Error("Grid must be 3 by 3");
    }

    // Validate grid elements
    for (let row of grid) {
        for (let num of row) {
            if (num === null || num === undefined) {
                throw new Error("Null or undefined values are not allowed");
            }
            if (typeof num === 'string') {
                throw new Error("Strings are not allowed");
            }
            if (Number.isNaN(num)) {
                throw new Error("NaN values are not allowed");
            }
            if (!Number.isInteger(num)) {
                throw new Error("Fractions are not allowed");
            }
            if (typeof num !== 'number') {
                throw new Error("Special characters are not allowed");
            }
        }
    }

    const rows = grid.length;
    const cols = grid[0].length;
    let maxSum = -Infinity;
    let bestPathNumbers = [];

    // Define the DFS function to explore all possible paths
    function dfs(row, col, sum, pathNumbers, path, visited) {
        // Base case: If we reach the bottom-right corner of the grid
        if (row === rows - 1 && col === cols - 1) {
            const currentSum = sum + grid[row][col];
            const currentPath = [...path, `${row},${col}`];
            const currentPathNumbers = [...pathNumbers, grid[row][col]];

            if (currentSum > maxSum) {
                maxSum = currentSum;
                bestPathNumbers = [...currentPathNumbers];
            }
            return;
        }

        // Boundary checks and visited check
        if (row < 0 || row >= rows || col < 0 || col >= cols || 
            visited.has(`${row},${col}`)) {
            return;
        }

        // Mark current cell as visited
        visited.add(`${row},${col}`);

        // Add current cell to path and pathNumbers
        path.push(`${row},${col}`);
        pathNumbers.push(grid[row][col]);

        // Add current cell's value to sum
        sum += grid[row][col];

        // Explore possible directions (right and down)
        dfs(row, col + 1, sum, pathNumbers, path, visited); // right
        dfs(row + 1, col, sum, pathNumbers, path, visited); // down

        // Backtrack
        path.pop();
        pathNumbers.pop();
        visited.delete(`${row},${col}`);
    }

    dfs(0, 0, 0, [], [], new Set());
    return { maxSum, bestPathNumbers };
}

module.exports = { getMaxSumPath };