function aStar(grid, start, end) {
  // Input validation
  if (!grid || !start || !end || !Array.isArray(grid) || grid.length === 0) {
      return null;
  }
  
  // Check if start and end points are valid
  if (!isValidPosition(grid, start) || !isValidPosition(grid, end)) {
      return null;
  }
  
  // Check if start or end points are obstacles
  if (grid[start.y][start.x] === 1 || grid[end.y][end.x] === 1) {
      return null;
  }

  const openSet = new Set([JSON.stringify(start)]);
  const closedSet = new Set();
  
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  
  gScore.set(JSON.stringify(start), 0);
  fScore.set(JSON.stringify(start), heuristic(start, end));
  
  while (openSet.size > 0) {
      // Find node with lowest fScore in openSet
      const current = JSON.parse(Array.from(openSet)
          .reduce((lowest, node) => 
              (fScore.get(node) < fScore.get(lowest) ? node : lowest)));
      
      // Check if we reached the end
      if (current.x === end.x && current.y === end.y) {
          return reconstructPath(cameFrom, JSON.stringify(current));
      }
      
      // Remove current from openSet and add to closedSet
      openSet.delete(JSON.stringify(current));
      closedSet.add(JSON.stringify(current));
      
      // Get neighbors
      const neighbors = getNeighbors(grid, current);
      
      for (const neighbor of neighbors) {
          const neighborStr = JSON.stringify(neighbor);
          
          // Skip if neighbor in closedSet
          if (closedSet.has(neighborStr)) {
              continue;
          }
          
          // Calculate tentative gScore
          const tentativeGScore = gScore.get(JSON.stringify(current)) + 1;
          
          if (!openSet.has(neighborStr)) {
              openSet.add(neighborStr);
          } else if (tentativeGScore >= gScore.get(neighborStr)) {
              continue;
          }
          
          // Update path and scores
          cameFrom.set(neighborStr, JSON.stringify(current));
          gScore.set(neighborStr, tentativeGScore);
          fScore.set(neighborStr, tentativeGScore + heuristic(neighbor, end));
      }
  }
  
  return null;
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(cameFrom, current) {
  const path = [JSON.parse(current)];
  while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(JSON.parse(current));
  }
  return path;
}

function getNeighbors(grid, position) {
  const neighbors = [];
  const directions = [
      {x: 0, y: -1}, // up
      {x: 1, y: 0},  // right
      {x: 0, y: 1},  // down
      {x: -1, y: 0}  // left
  ];
  
  for (const dir of directions) {
      const neighbor = {
          x: position.x + dir.x,
          y: position.y + dir.y
      };
      
      if (isValidPosition(grid, neighbor) && grid[neighbor.y][neighbor.x] === 0) {
          neighbors.push(neighbor);
      }
  }
  
  return neighbors;
}

function isValidPosition(grid, position) {
  return position.x >= 0 && 
         position.x < grid[0].length && 
         position.y >= 0 && 
         position.y < grid.length;
}

module.exports = {aStar};