function getMaxSumPath(grid) {
  // Check if the grid is 3x3
  if (grid.length !== 3 || grid[0].length !== 3) {
    throw new Error("Grid must be 3 by 3");
  }

  // Check for invalid input
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (typeof grid[i][j] !== "number") {
        throw new Error("Strings are not allowed");
      }
      if (isNaN(grid[i][j])) {
        throw new Error("NaN values are not allowed");
      }
      if (grid[i][j] % 1 !== 0) {
        throw new Error("Fractions are not allowed");
      }
      if (grid[i][j] === null || grid[i][j] === undefined) {
        throw new Error("Null or undefined values are not allowed");
      }
    }
  }

  // Define variables and initials
  let maxSum = -Infinity;
  let bestPathNumbers = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Define the DFS function to explore all possible paths
  function dfs(row, col, sum, pathNumbers, visited) {
    // Validations
    if (row < 0 || row >= rows || col < 0 || col >= cols || visited.has(`${row},${col}`)) {
      return;
    }

    // Base case: If we reach the bottom-right corner of the grid
    if (row === rows - 1 && col === cols - 1) {
      // Add the value of the current cell to the sum
      sum += grid[row][col];

      // Add the current cell to the path and pathNumbers
      pathNumbers.push(grid[row][col]);

      if (sum > maxSum) {
        // Update the maximum sum and the best path
        maxSum = sum;
        bestPathNumbers = [...pathNumbers];
      }

      // Backtrack: Remove the current cell from the path and pathNumbers
      pathNumbers.pop();

      return;
    }

    // Mark the current cell as visited
    visited.add(`${row},${col}`);

    // Add the current cell to the path and pathNumbers
    pathNumbers.push(grid[row][col]);

    // Add the current cell's value to the sum
    sum += grid[row][col];

    // Explore all possible directions: left, right, and down
    dfs(row, col - 1, sum, pathNumbers, visited);
    dfs(row, col + 1, sum, pathNumbers, visited);
    dfs(row + 1, col, sum, pathNumbers, visited);

    // Backtrack: Remove the current cell from the path and pathNumbers
    pathNumbers.pop();

    // Unmark the current cell as visited
    visited.delete(`${row},${col}`);
  }

  dfs(0, 0, 0, [], new Set());
  return { maxSum, bestPathNumbers };
}

module.exports = { getMaxSumPath };