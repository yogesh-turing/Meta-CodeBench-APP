function aStar(grid, start, end) {
  // Validate input parameters
  if (!grid || !start || !end || !grid.length || !grid[0].length) {
      return null;
  }
  
  if (start.x < 0 || start.x >= grid[0].length || start.y < 0 || start.y >= grid.length ||
      end.x < 0 || end.x >= grid[0].length || end.y < 0 || end.y >= grid.length) {
      return null;
  }
  
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
      
      // Remove current from openSet and add to closedSet
      openSet.delete(currentStr);
      closedSet.add(currentStr);
      
      // Get neighbors
      const neighbors = getNeighbors(current, grid);
      
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
          
          // Update path and scores
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

function getNeighbors(node, grid) {
  const neighbors = [];
  const directions = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }   // right
  ];
  
  for (const dir of directions) {
      const newX = node.x + dir.x;
      const newY = node.y + dir.y;
      
      // Check boundaries and walkable space
      if (newX >= 0 && newX < grid[0].length && 
          newY >= 0 && newY < grid.length && 
          grid[newY][newX] === 0) {
          neighbors.push({ x: newX, y: newY });
      }
  }
  
  return neighbors;
}

module.exports = {aStar};