function getMaxSumPath(grid) {
    // Input validations
    if (!grid || !Array.isArray(grid)) {
        throw new Error("Null or undefined values are not allowed");
    }

    if (grid.length !== 3 || grid.some(row => row.length !== 3)) {
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
            if (isNaN(num)) {
                throw new Error("NaN values are not allowed");
            }
            if (!Number.isInteger(num)) {
                throw new Error("Fractions are not allowed");
            }
            if (typeof num === 'object') {
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
            pathNumbers.push(grid[row][col]);
            path.push(`${row},${col}`);

            if (sum > maxSum) {
                maxSum = sum;
                bestPathNumbers = [...pathNumbers];
            }

            pathNumbers.pop();
            path.pop();
            return;
        }

        // Boundary checks and visited check
        if (row < 0 || row >= rows || col < 0 || col >= cols || 
            visited.has(`${row},${col}`)) {
            return;
        }

        // Mark current cell as visited
        visited.add(`${row},${col}`);
        pathNumbers.push(grid[row][col]);
        path.push(`${row},${col}`);

        // Current sum
        sum += grid[row][col];

        // Explore all possible directions (right, down, left)
        const directions = [
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        for (let [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            dfs(newRow, newCol, sum, pathNumbers, path, visited);
        }

        // Backtrack
        visited.delete(`${row},${col}`);
        pathNumbers.pop();
        path.pop();
    }

    dfs(0, 0, 0, [], [], new Set());
    return { maxSum, bestPathNumbers };
}

module.exports = { getMaxSumPath };