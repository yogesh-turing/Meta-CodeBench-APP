function aStar(grid, start, end) {
  // Input validation
  if (!grid || !start || !end || !Array.isArray(grid) || grid.length === 0) {
      return null;
  }
  
  // Check if start and end points are valid
  if (start.x < 0 || start.x >= grid[0].length || start.y < 0 || start.y >= grid.length ||
      end.x < 0 || end.x >= grid[0].length || end.y < 0 || end.y >= grid.length) {
      return null;
  }
  
  // Check if start or end points are blocked
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
      let current = null;
      let lowestFScore = Infinity;
      
      for (const nodeStr of openSet) {
          const f = fScore.get(nodeStr) || Infinity;
          if (f < lowestFScore) {
              lowestFScore = f;
              current = JSON.parse(nodeStr);
          }
      }
      
      const currentStr = JSON.stringify(current);
      
      // Check if we reached the end
      if (current.x === end.x && current.y === end.y) {
          return reconstructPath(cameFrom, currentStr);
      }
      
      openSet.delete(currentStr);
      closedSet.add(currentStr);
      
      // Get neighbors
      const neighbors = [
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y },
          { x: current.x, y: current.y + 1 },
          { x: current.x, y: current.y - 1 }
      ].filter(n => 
          n.x >= 0 && n.x < grid[0].length &&
          n.y >= 0 && n.y < grid.length &&
          grid[n.y][n.x] !== 1
      );
      
      for (const neighbor of neighbors) {
          const neighborStr = JSON.stringify(neighbor);
          
          if (closedSet.has(neighborStr)) {
              continue;
          }
          
          const tentativeGScore = (gScore.get(currentStr) || Infinity) + 1;
          
          if (!openSet.has(neighborStr)) {
              openSet.add(neighborStr);
          } else if (tentativeGScore >= (gScore.get(neighborStr) || Infinity)) {
              continue;
          }
          
          cameFrom.set(neighborStr, currentStr);
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

module.exports = {aStar};