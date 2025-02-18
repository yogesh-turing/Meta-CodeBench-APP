const findLargestConnectedComponent = (graph) => {
  if (!graph || typeof graph !== "object" || Array.isArray(graph)) {
    throw new Error("Invalid input: graph must be an adjacency list object");
  }

  const visited = new Set();
  let largestSize = 0;

  const dfs = (node) => {
    if (visited.has(node)) return 0;
    visited.add(node);
    
    let size = 1;
    if (graph[node]) {
      for (let neighbor of graph[node]) {
        size += dfs(neighbor);
      }
    }
    
    return size;
  };

  for (let node in graph) {
    if (!visited.has(node)) {
      largestSize = Math.max(largestSize, dfs(node));
    }
  }

  return largestSize;
};

module.exports = { findLargestConnectedComponent };