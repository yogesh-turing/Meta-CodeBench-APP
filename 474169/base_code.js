function getMaxSumPath(grid) {
//To Do: Define variables and intials

  // Define the DFS  function to explore all possible paths
  function dfs(row, col, sum, pathNumbers, visited) {
    //To DO: Validations

    // Base case: If we reach the bottom-right corner of the grid
    if (row === rows - 1 && col === cols - 1) {
      //To Do:  Add the value of the current cell to the sum
    
      // To Do:  Add the current cell to the path and pathNumbers

      if (sum > maxSum) {
        //To Do:  Update the maximum sum and the best path
      }

      // To Do:  Backtrack: Remove the current cell from the path and pathNumbers

      
    }

    ////To Do:  Boundary checks: If the current cell is out of bounds or already visited, stop exploring
    if (
      

    
    ) {
      return;
    }

    //To Do: Mark the current cell as visited
 
    // To Do: Add the current cell to the path and pathNumbers

    // Add the current cell's value to the sum
    sum += grid[row][col];

    //To Do: Explore all possible directions:
    

    //To Do:  Backtrack: Remove the current cell from the path and pathNumbers
    

    //To Do:  Unmark the current cell as visited
  }

  dfs(0, 0, 0, [], [], new Set());
  return { maxSum, bestPathNumbers };
}
module.exports = { getMaxSumPath };