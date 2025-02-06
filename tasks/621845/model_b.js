function aStar(grid, start, end) {
  // Validate input parameters
  if (!grid || !start || !end || !grid.length || !grid[0].length) {
      return null;
  }
  
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Validate start and end positions
  if (start.x < 0 || start.x >= cols || start.y < 0 || start.y >= rows ||
      end.x < 0 || end.x >= cols || end.y < 0 || end.y >= rows ||
      grid[start.y][start.x] === 1 || grid[end.y][end.x] === 1) {
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
      let current = null;
      let lowestFScore = Infinity;
      
      for (const nodeStr of openSet) {
          const score = fScore.get(nodeStr) || Infinity;
          if (score < lowestFScore) {
              lowestFScore = score;
              current = JSON.parse(nodeStr);
          }
      }
      
      const currentStr = JSON.stringify(current);
      
      // Check if we reached the end
      if (current.x === end.x && current.y === end.y) {
          return reconstructPath(cameFrom, currentStr);
      }
      
      // Remove current from openSet and add to closedSet
      openSet.delete(currentStr);
      closedSet.add(currentStr);
      
      // Get neighbors
      const directions = [
          {x: 0, y: -1}, // up
          {x: 0, y: 1},  // down
          {x: -1, y: 0}, // left
          {x: 1, y: 0}   // right
      ];
      
      for (const dir of directions) {
          const neighbor = {
              x: current.x + dir.x,
              y: current.y + dir.y
          };
          
          // Skip if outside grid or blocked
          if (neighbor.x < 0 || neighbor.x >= cols ||
              neighbor.y < 0 || neighbor.y >= rows ||
              grid[neighbor.y][neighbor.x] === 1) {
              continue;
          }
          
          const neighborStr = JSON.stringify(neighbor);
          
          // Skip if in closedSet
          if (closedSet.has(neighborStr)) {
              continue;
          }
          
          // Calculate tentative gScore
          const tentativeGScore = (gScore.get(currentStr) || Infinity) + 1;
          
          // Add to openSet if not there
          if (!openSet.has(neighborStr)) {
              openSet.add(neighborStr);
          }
          
          // Check if new path is better
          if (tentativeGScore < (gScore.get(neighborStr) || Infinity)) {
              // Update path and scores
              cameFrom.set(neighborStr, currentStr);
              gScore.set(neighborStr, tentativeGScore);
              fScore.set(neighborStr, tentativeGScore + heuristic(neighbor, end));
          }
      }
  }
  
  // No path found
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

module.exports = {aStar};