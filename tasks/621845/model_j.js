function aStar(grid, start, end) {
  // Priority queue for open nodes
  const openSet = new Set([start]);
  // Set to keep track of visited nodes
  const closedSet = new Set();
  
  // Track path and scores
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  
  // Initialize scores
  gScore.set(start, 0);
  fScore.set(start, heuristic(start, end));
  
  while (openSet.size > 0) {
      // Find node with lowest fScore in openSet
      let current = null;
      let lowestFScore = Infinity;
      for (const node of openSet) {
          const score = fScore.get(node);
          if (score < lowestFScore) {
              lowestFScore = score;
              current = node;
          }
      }
      
      // Check if we reached the end
      if (current.x === end.x && current.y === end.y) {
          return reconstructPath(cameFrom, current);
      }
      
      // Remove current from openSet
      openSet.delete(current);
      // Add current to closedSet
      closedSet.add(current);
      
      // Get neighbors of current node
      const neighbors = getNeighbors(grid, current);
      
      for (const neighbor of neighbors) {
          // Skip if neighbor in closedSet
          if (closedSet.has(neighbor)) {
              continue;
          }
          
          // Calculate tentative gScore
          const tentativeGScore = gScore.get(current) + 1;
          
          // Check if new path is better
          if (!openSet.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
              // Update path and scores if better
              cameFrom.set(neighbor, current);
              gScore.set(neighbor, tentativeGScore);
              fScore.set(neighbor, tentativeGScore + heuristic(neighbor, end));
              openSet.add(neighbor);
          }
      }
  }
  
  // Return null if no path found
  return null;
}

// Helper function to calculate heuristic (Manhattan distance)
function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Helper function to reconstruct path
function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(current);
  }
  return path;
}

// Helper function to get neighbors of a node
function getNeighbors(grid, node) {
  const neighbors = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const direction of directions) {
      const x = node.x + direction[0];
      const y = node.y + direction[1];
      if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] === 0) {
          neighbors.push({ x, y });
      }
  }
  return neighbors;
}

module.exports = { aStar };