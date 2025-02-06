Base Code:
```javascript
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
        // TODO: Find node with lowest fScore in openSet
        const current = null; // Implementation needed
        
        // TODO: Check if we reached the end
        
        // TODO: Remove current from openSet
        // TODO: Add current to closedSet
        
        // TODO: Get neighbors of current node
        const neighbors = []; // Implementation needed
        
        for (const neighbor of neighbors) {
            // TODO: Skip if neighbor in closedSet
            
            // TODO: Calculate tentative gScore
            
            // TODO: Check if new path is better
            
            // TODO: Update path and scores if better
        }
    }
    
    // TODO: Return null if no path found
    return null;
}

// Helper function to calculate heuristic (Manhattan distance)
function heuristic(a, b) {
    // TODO: Implement Manhattan distance calculation
    return 0;
}

// Helper function to reconstruct path
function reconstructPath(cameFrom, current) {
    // TODO: Implement path reconstruction
    return [];
}

module.exports = {aStar}
```

Prompt:
Develop JavaScript code for implementing the pathfinding algorithm A* on a 2D grid. The grid cells would either be walkable (0) or blocked (1), and an attempt would be made in attempting to find the shortest path from a starting position to an endpoint while avoiding any obstacles.

Your task:
Fill in all the TODO parts of the skeleton code.

What the program should do:
- Use Manhattan distance heuristic that will serve reasonably well in estimating the cost from some cell toward the goal.
- Only allow movement up, down, left, or right; diagonal movement must not be allowed.
- Represent each grid cell as an object: { x: number, y: number }.
- Claim an array of coordinates containing the shortest path;
- If that path is found invalid, return null.
- Edge cases such as invalid inputs or unavailable paths must also be handled.

Some of the following key features:

Keep track of visited nodes.
- Calculate g-scores (the distance from the start) and h-scores (the estimated distance towards goal).
- Update paths for which there has been new superior discovery.
- Be sure to check carefully for all edge cases.