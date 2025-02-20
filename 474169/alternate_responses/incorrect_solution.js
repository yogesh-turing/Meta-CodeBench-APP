function getMaxSumPath(grid) {
    // Input validations
    if (!grid || !Array.isArray(grid) || grid.length !== 3 || 
        !grid.every(row => Array.isArray(row) && row.length === 3)) {
        throw new Error("Grid must be 3 by 3");
    }

    // Validate grid elements
    for (let row of grid) {
        for (let cell of row) {
            if (cell === null || cell === undefined) {
                throw new Error("Null or undefined values are not allowed");
            }
            if (typeof cell === 'string') {
                throw new Error("Strings are not allowed");
            }
            if (isNaN(cell) || cell === Infinity || cell === -Infinity) {
                throw new Error("NaN values are not allowed");
            }
            if (cell % 1 !== 0) {
                throw new Error("Fractions are not allowed");
            }
            if (typeof cell !== 'number') {
                throw new Error("Special characters are not allowed");
            }
        }
    }

    const rows = grid.length;
    const cols = grid[0].length;
    let maxSum = -Infinity;
    let bestPathNumbers = [];

    function dfs(row, col, sum, pathNumbers, path, visited) {
        // Base case: reached bottom-right corner
        if (row === rows - 1 && col === cols - 1) {
            sum += grid[row][col];
            pathNumbers = [...pathNumbers, grid[row][col]];

            if (sum > maxSum) {
                maxSum = sum;
                bestPathNumbers = [...pathNumbers];
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

        // Add current cell to path
        pathNumbers.push(grid[row][col]);
        path.push([row, col]);

        // Add current cell's value to sum
        sum += grid[row][col];

        // Explore possible directions (right and down)
        dfs(row, col + 1, sum, pathNumbers, path, visited); // right
        dfs(row + 1, col, sum, pathNumbers, path, visited); // down

        // Backtrack
        pathNumbers.pop();
        path.pop();
        visited.delete(`${row},${col}`);
    }

    dfs(0, 0, 0, [], [], new Set());
    return { maxSum, bestPathNumbers };
}

module.exports = { getMaxSumPath };