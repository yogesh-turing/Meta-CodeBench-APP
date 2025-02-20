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
  const adjList = graph.getAdjList();

  // Initialize distances and previous nodes
  const distances = new Map();
  const previousNodes = new Map();
  for (let node of adjList.keys()) {
    distances.set(node, Infinity);
    previousNodes.set(node, null);
  }
  distances.set(startNode, 0); // Start node has distance 0

  // Create a priority queue (min-heap)
  const priorityQueue = [];
  priorityQueue.push([startNode, 0]);

  while (priorityQueue.length > 0) {
    // Extract the node with the smallest distance from the priority queue
    let [currentNode, currentDistance] = priorityQueue.shift();

    // If the current node is the end node, reconstruct the path
    if (currentNode === endNode) {
      const path = [];
      while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = previousNodes.get(currentNode);
      }
      return new DijkstraResult(path, currentDistance);
    }

    // Process the neighbors of the current node
    for (let [neighbor, weight] of adjList.get(currentNode)) {
      const newDistance = currentDistance + weight;
      if (newDistance < distances.get(neighbor)) {
        distances.set(neighbor, newDistance);
        previousNodes.set(neighbor, currentNode);
        priorityQueue.push([neighbor, newDistance]);
        // Sort the priority queue to maintain the min-heap property
        priorityQueue.sort((a, b) => a[1] - b[1]);
      }
    }
  }

  // If no path exists, return an empty list and distance -1
  return new DijkstraResult([], -1);
}

module.exports = {
  Graph,
  DijkstraResult,
  dijkstraShortestPath,
};