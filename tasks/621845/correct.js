function aStar(grid, start, end) {
  // Input validation
  if (!grid || !start || !end || !grid.length) {
    return null;
  }

  // Check for irregular grid shape
  const rowLengths = grid.map((row) => row.length);
  if (!rowLengths.every((length) => length === rowLengths[0])) {
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

  // Special case for start and end being the same
  if (start.x === end.x && start.y === end.y) {
    return [{ x: start.x, y: start.y }];
  }

  // Priority queue for open nodes
  let openSet = [
    {
      pos: start,
      f: heuristic(start, end),
      g: 0,
    },
  ];

  // Track visited nodes and paths
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = new Map();

  // Initialize scores
  gScore.set(JSON.stringify(start), 0);

  while (openSet.length > 0) {
    // Find and remove node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const currentPos = current.pos;
    const currentPosStr = JSON.stringify(currentPos);

    // Check if we reached the end
    if (currentPos.x === end.x && currentPos.y === end.y) {
      return reconstructPath(cameFrom, currentPosStr);
    }

    closedSet.add(currentPosStr);

    // Check all neighbors
    const neighbors = getNeighbors(currentPos, grid);
    for (const neighbor of neighbors) {
      const neighborStr = JSON.stringify(neighbor);

      // Skip if already evaluated
      if (closedSet.has(neighborStr)) {
        continue;
      }

      // Calculate g score for this path
      const tentativeGScore = current.g + 1;

      // Find if neighbor is in openSet
      const neighborNode = openSet.find(
        (node) => node.pos.x === neighbor.x && node.pos.y === neighbor.y
      );

      if (!neighborNode) {
        // Discovered a new node
        openSet.push({
          pos: neighbor,
          g: tentativeGScore,
          f: tentativeGScore + heuristic(neighbor, end),
        });
        cameFrom.set(neighborStr, currentPosStr);
        gScore.set(neighborStr, tentativeGScore);
      } else if (tentativeGScore < neighborNode.g) {
        // Found a better path
        neighborNode.g = tentativeGScore;
        neighborNode.f = tentativeGScore + heuristic(neighbor, end);
        cameFrom.set(neighborStr, currentPosStr);
        gScore.set(neighborStr, tentativeGScore);
      }
    }
  }

  // No path found
  return null;
}

// Helper function to calculate Manhattan distance heuristic
function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Helper function to get valid neighbors
function getNeighbors(node, grid) {
  const neighbors = [];
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
  ];

  for (const dir of directions) {
    const newX = node.x + dir.x;
    const newY = node.y + dir.y;

    // Check if within grid bounds and walkable
    if (
      newY >= 0 &&
      newY < grid.length &&
      newX >= 0 &&
      newX < grid[newY].length &&
      grid[newY][newX] === 0
    ) {
      neighbors.push({ x: newX, y: newY });
    }
  }

  return neighbors;
}

// Helper function to reconstruct path
function reconstructPath(cameFrom, current) {
  const path = [JSON.parse(current)];

  while (cameFrom.has(current)) {
    current = cameFrom.get(current);
    path.unshift(JSON.parse(current));
  }

  return path;
}

module.exports = { aStar };
