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
  const distances = new Map();
  const previousNodes = new Map();
  const priorityQueue = [];

  // Initialize distances and previous nodes
  for (const node of graph.getAdjList().keys()) {
    distances.set(node, Infinity);
    previousNodes.set(node, null);
  }
  distances.set(startNode, 0);

  // Add start node to priority queue
  priorityQueue.push([startNode, 0]);

  while (priorityQueue.length > 0) {
    // Extract node with minimum distance from priority queue
    const [currentNode, currentDistance] = priorityQueue.shift();

    // If current node is the end node, reconstruct path and return
    if (currentNode === endNode) {
      const path = [];
      let node = endNode;
      while (node !== null) {
        path.unshift(node);
        node = previousNodes.get(node);
      }
      return new DijkstraResult(path, currentDistance);
    }

    // If current distance is greater than already known distance, skip
    if (currentDistance > distances.get(currentNode)) {
      continue;
    }

    // Explore neighbors of current node
    for (const [neighbor, weight] of graph.getAdjList().get(currentNode)) {
      const distance = currentDistance + weight;

      // If shorter path to neighbor is found, update distance and previous node
      if (distance < distances.get(neighbor)) {
        distances.set(neighbor, distance);
        previousNodes.set(neighbor, currentNode);
        priorityQueue.push([neighbor, distance]);
        priorityQueue.sort((a, b) => a[1] - b[1]); // Sort priority queue by distance
      }
    }
  }

  // If no path exists, return empty list and distance -1
  return new DijkstraResult([], -1);
}

module.exports = {
  Graph,
  DijkstraResult,
  dijkstraShortestPath,
};