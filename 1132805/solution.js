const findLargestConnectedComponent = (graph) => {
    // Validate input: check if the graph is an object and not an array
    if (!graph || typeof graph !== "object" || Array.isArray(graph)) {
      throw new Error("Invalid input: graph must be an adjacency list object");
    }
  
    // Ensure that all nodes reference arrays
    for (let node in graph) {
      if (!Array.isArray(graph[node])) {
        throw new Error("Invalid input: graph must be an adjacency list object");
      }
    }
  
    const visited = new Set();
    let largestSize = 0;
  
    // Depth*First Search (DFS) to traverse the graph iteratively
    const dfs = (node) => {
      const stack = [node];
      let size = 0;
  
      // Traverse the graph using a stack to avoid deep recursion
      while (stack.length > 0) {
        const currentNode = stack.pop();
        if (!visited.has(currentNode)) {
          visited.add(currentNode);
          size += 1;
  
          // Check neighbors and add them to the stack if not visited
          if (graph[currentNode]) {
            for (let neighbor of graph[currentNode]) {
              if (!visited.has(neighbor)) {
                stack.push(neighbor);
              }
            }
          }
        }
      }
  
      return size;
    };
  
    // Iterate over all nodes to find the largest connected component
    for (let node in graph) {
      if (!visited.has(node)) {
        const componentSize = dfs(node);
        largestSize = Math.max(largestSize, componentSize);
      }
    }
  
    return largestSize;
  };
  
  module.exports = { findLargestConnectedComponent };