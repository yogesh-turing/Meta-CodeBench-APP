function getMaxSumPath(grid) {
  // Check if the grid is 3x3
  if (grid.length !== 3 || grid[0].length !== 3) {
    throw new Error("Grid must be 3 by 3");
  }

  // Initialize variables
  let maxSum = -Infinity;
  let bestPathNumbers = [];

  // Define the DFS function to explore all possible paths
  function dfs(row, col, sum, pathNumbers, visited) {
    // Validations
    if (
      typeof grid[row][col] !== "number" ||
      grid[row][col] % 1 !== 0 ||
      isNaN(grid[row][col]) ||
      grid[row][col] === null ||
      grid[row][col] === undefined
    ) {
      throw new Error("Only positive and negative integers are allowed");
    }

    if (typeof grid[row][col] === "string") {
      throw new Error("Strings are not allowed");
    }

    // Base case: If we reach the bottom-right corner of the grid
    if (row === 2 && col === 2) {
      sum += grid[row][col];
      pathNumbers.push(grid[row][col]);

      if (sum > maxSum) {
        maxSum = sum;
        bestPathNumbers = [...pathNumbers];
      }

      // Backtrack: Remove the current cell from the path and pathNumbers
      pathNumbers.pop();
      return;
    }

    // Boundary checks: If the current cell is out of bounds or already visited, stop exploring
    if (row < 0 || row > 2 || col < 0 || col > 2 || visited.has(`${row},${col}`)) {
      return;
    }

    // Mark the current cell as visited
    visited.add(`${row},${col}`);

    // Add the current cell to the path and pathNumbers
    pathNumbers.push(grid[row][col]);

    // Add the current cell's value to the sum
    sum += grid[row][col];

    // Explore all possible directions: right, down, left
    dfs(row, col + 1, sum, pathNumbers, visited);
    dfs(row + 1, col, sum, pathNumbers, visited);
    dfs(row, col - 1, sum, pathNumbers, visited);

    // Backtrack: Remove the current cell from the path and pathNumbers
    pathNumbers.pop();

    // Unmark the current cell as visited
    visited.delete(`${row},${col}`);
  }

  dfs(0, 0, 0, [], new Set());
  return { maxSum, bestPathNumbers };
}

module.exports = { getMaxSumPath };