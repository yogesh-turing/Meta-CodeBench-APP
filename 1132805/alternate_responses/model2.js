const findLargestConnectedComponent = (graph) => {
    // Input validation
    if (!graph || typeof graph !== "object" || Array.isArray(graph)) {
      throw new Error("Invalid input: graph must be an adjacency list object");
    }
  
    // Handle empty graph
    if (Object.keys(graph).length === 0) {
      return 0;
    }
  
    const visited = new Set();
    let largestSize = 0;
  
    // DFS helper function to count component size
    const dfs = (node) => {
      if (visited.has(node)) return 0;
      visited.add(node);
      
      let size = 1;
      // Check if node has neighbors
      if (graph[node]) {
        for (let neighbor of graph[node]) {
          size += dfs(neighbor);
        }
      }
      
      return size;
    };
  
    // Iterate through all nodes to find components
    for (let node in graph) {
      if (!visited.has(node)) {
        const componentSize = dfs(node);
        largestSize = Math.max(largestSize, componentSize);
      }
    }
  
    return largestSize;
  };
  
  module.exports = { findLargestConnectedComponent };