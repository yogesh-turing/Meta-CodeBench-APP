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
    for (let cell of row) {
      if (cell === null || cell === undefined) {
        throw new Error("Null or undefined values are not allowed");
      }
      if (typeof cell === 'string') {
        throw new Error("Strings are not allowed");
      }
      if (isNaN(cell) || cell === NaN) {
        throw new Error("NaN values are not allowed");
      }
      if (cell % 1 !== 0) {
        throw new Error("Fractions are not allowed");
      }
      if (typeof cell === 'object' || typeof cell === 'symbol') {
        throw new Error("Special characters are not allowed");
      }
    }
  }

  const rows = grid.length;
  const cols = grid[0].length;
  let maxSum = -Infinity;
  let bestPathNumbers = [];

  // Define the DFS function to explore all possible paths
  function dfs(row, col, sum, pathNumbers, visited) {
    // Base case: If we reach the bottom-right corner of the grid
    if (row === rows - 1 && col === cols - 1) {
      const finalSum = sum + grid[row][col];
      const finalPath = [...pathNumbers, grid[row][col]];

      if (finalSum > maxSum) {
        maxSum = finalSum;
        bestPathNumbers = [...finalPath];
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

    // Add current cell's value to sum
    sum += grid[row][col];

    // Explore possible directions (right, down, left)
    const directions = [
      [0, 1],  // right
      [1, 0],  // down
      [0, -1]  // left
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      dfs(newRow, newCol, sum, pathNumbers, visited);
    }

    // Backtrack
    pathNumbers.pop();
    visited.delete(`${row},${col}`);
  }

  dfs(0, 0, 0, [], new Set());
  return { maxSum, bestPathNumbers };
}

module.exports = { getMaxSumPath };