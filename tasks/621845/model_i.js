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
  gScore.set(`${start.x},${start.y}`, 0);
  fScore.set(`${start.x},${start.y}`, heuristic(start, end));
  
  while (openSet.size > 0) {
      // Find node with lowest fScore in openSet
      const current = [...openSet].reduce((min, node) => {
          const fScoreCurrent = fScore.get(`${node.x},${node.y}`);
          const fScoreMin = fScore.get(`${min.x},${min.y}`);
          return fScoreCurrent < fScoreMin ? node : min;
      }, [...openSet][0]);
      
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
          const tentativeGScore = gScore.get(`${current.x},${current.y}`) + 1;
          
          // Check if new path is better
          if (!gScore.has(`${neighbor.x},${neighbor.y}`) || tentativeGScore < gScore.get(`${neighbor.x},${neighbor.y}`)) {
              // Update path and scores if better
              cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
              gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
              fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + heuristic(neighbor, end));
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
  while (cameFrom.has(`${current.x},${current.y}`)) {
      current = cameFrom.get(`${current.x},${current.y}`);
      path.unshift(current);
  }
  return path;
}

// Helper function to get neighbors
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