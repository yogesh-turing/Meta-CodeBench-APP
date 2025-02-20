class Graph {
  constructor() {
    this.adjList = new Map();
  }

  addEdge(from, to, weight) {
    if (!this.adjList.has(from)) this.adjList.set(from, []);
    this.adjList.get(from).push([to, weight]);
    if (!this.adjList.has(to)) this.adjList.set(to, []); // Ensure both nodes exist
  }

  getAdjList() {
    return this.adjList;
  }
}

class DijkstraResult {
  constructor(path, distance) {
    this.path = path;
    this.distance = distance;
  }
}

function dijkstraShortestPath(graph, startNode, endNode) {
  // TODO: Implement the code here
}

function main() {
  const graph = new Graph();
  graph.addEdge(0, 1, 4);
  graph.addEdge(0, 2, 1);
  graph.addEdge(2, 1, 2);
  graph.addEdge(1, 3, 5);
  graph.addEdge(2, 3, 8);

  const result = dijkstraShortestPath(graph, 0, 3);

  if (result.distance !== -1) {
    console.log("Shortest path:", result.path);
    console.log("Total distance:", result.distance);
  } else {
    console.log("No path found.");
  }
}

// Export for testing or external usage
module.exports = { Graph, DijkstraResult, dijkstraShortestPath, main };