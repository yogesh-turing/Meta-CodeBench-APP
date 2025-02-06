// A* algorithm implementation
function aStar(grid, start, end) {
  if (!grid || !grid.length || !grid[0].length || !start || !end) {
    return null;
  }
  if (
    start.x < 0 ||
    start.y < 0 ||
    start.y >= grid.length ||
    start.x >= grid[start.y].length ||
    end.x < 0 ||
    end.y < 0 ||
    end.y >= grid.length ||
    end.x >= grid[end.y].length
  ) {
    return null;
  }

  if (grid[start.y][start.x] === 1 || grid[end.y][end.x] === 1) {
    return null;
  }
  
  const rows = grid.length;
  const cols = grid[0].length;

  const openSet = [start];
  const cameFrom = new Map();

  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

  gScore[start[0]][start[1]] = 0;
  fScore[start[0]][start[1]] = manhattanDistance(start, end);

  while (openSet.length > 0) {
    // Find the node in openSet with the lowest fScore
    let current = openSet.reduce((a, b) => (fScore[a[0]][a[1]] < fScore[b[0]][b[1]] ? a : b));

    // Check if the goal is reached
    if (current[0] === end[0] && current[1] === end[1]) {
      return reconstructPath(cameFrom, current);
    }

    // Remove current from openSet
    openSet.splice(openSet.indexOf(current), 1);

    // Explore neighbors
    for (const neighbor of getNeighbors(current, grid)) {
      const tentativeGScore = gScore[current[0]][current[1]] + 1;

      if (tentativeGScore < gScore[neighbor[0]][neighbor[1]]) {
        cameFrom.set(`${neighbor[0]}-${neighbor[1]}`, current);
        gScore[neighbor[0]][neighbor[1]] = tentativeGScore;
        fScore[neighbor[0]][neighbor[1]] = tentativeGScore + manhattanDistance(neighbor, end);

        if (!openSet.some(([r, c]) => r === neighbor[0] && c === neighbor[1])) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return null; // No path found
}

// Manhattan distance heuristic
function manhattanDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Get neighbors of a cell in a deterministic order
function getNeighbors([row, col], grid) {
  const neighbors = [];
  const directions = [
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
    [-1, 0], // Up
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      grid[newRow][newCol] === 0 // Ensure the cell is walkable
    ) {
      neighbors.push([newRow, newCol]);
    }
  }

  return neighbors;
}

// Reconstruct path from the cameFrom map
function reconstructPath(cameFrom, current) {
  const path = [current];

  while (cameFrom.has(`${current[0]}-${current[1]}`)) {
    current = cameFrom.get(`${current[0]}-${current[1]}`);
    path.push(current);
  }

  return path.reverse();
}

module.exports = { aStar };
