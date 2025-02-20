function getMaxSumPath(grid) {
  // Validate the grid size
  if (grid.length !== 3 || grid[0].length !== 3) {
    throw new Error("Grid must be 3 by 3");
  }

  // Validate the grid elements
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (typeof grid[i][j] !== "number" || !Number.isInteger(grid[i][j])) {
        throw new Error("Fractions are not allowed");
      }
      if (isNaN(grid[i][j])) {
        throw new Error("NaN values are not allowed");
      }
      if (grid[i][j] === null || grid[i][j] === undefined) {
        throw new Error("Null or undefined values are not allowed");
      }
      if (typeof grid[i][j] === "string") {
        throw new Error("Strings are not allowed");
      }
      if (!/^-?\d+$/.test(grid[i][j].toString())) {
        throw new Error("Special characters are not allowed");
      }
    }
  }

  // Define variables
  const rows = grid.length;
  const cols = grid[0].length;
  let maxSum = -Infinity;
  let bestPathNumbers = [];

  // Define the DFS function to explore all possible paths
  function dfs(row, col, sum, pathNumbers, visited) {
    // Base case: If we reach the bottom-right corner of the grid
    if (row === rows - 1 && col === cols - 1) {
      sum += grid[row][col];
      pathNumbers.push(grid[row][col]);
      if (sum > maxSum) {
        maxSum = sum;
        bestPathNumbers = [...pathNumbers];
      }
      pathNumbers.pop();
      return;
    }

    // Boundary checks: If the current cell is out of bounds or already visited, stop exploring
    if (row < 0 || row >= rows || col < 0 || col >= cols || visited.has(`${row},${col}`)) {
      return;
    }

    // Mark the current cell as visited
    visited.add(`${row},${col}`);

    // Add the current cell to the path and pathNumbers
    pathNumbers.push(grid[row][col]);

    // Add the current cell's value to the sum
    sum += grid[row][col];

    // Explore all possible directions
    dfs(row, col + 1, sum, pathNumbers, visited); // Right
    dfs(row + 1, col, sum, pathNumbers, visited); // Down
    dfs(row, col - 1, sum, pathNumbers, visited); // Left

    // Backtrack: Remove the current cell from the path and pathNumbers
    pathNumbers.pop();

    // Unmark the current cell as visited
    visited.delete(`${row},${col}`);
  }

  dfs(0, 0, 0, [], new Set());
  return { maxSum, bestPathNumbers };
}

module.exports = { getMaxSumPath };