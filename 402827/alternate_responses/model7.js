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
  const distances = new Map();
  const previousNodes = new Map();
  const priorityQueue = [];

  // Initialize distances and previous nodes
  for (let node of adjList.keys()) {
    distances.set(node, Infinity);
    previousNodes.set(node, null);
  }
  distances.set(startNode, 0);

  // Add start node to priority queue
  priorityQueue.push([startNode, 0]);

  while (priorityQueue.length > 0) {
    // Extract node with minimum distance from priority queue
    let [node, distance] = priorityQueue.shift();

    // Skip if the node has already been processed
    if (distance > distances.get(node)) continue;

    // Process all neighbors of the current node
    for (let [neighbor, weight] of adjList.get(node)) {
      let newDistance = distance + weight;

      // Update the shortest distance if a shorter path is found
      if (newDistance < distances.get(neighbor)) {
        distances.set(neighbor, newDistance);
        previousNodes.set(neighbor, node);
        priorityQueue.push([neighbor, newDistance]);
      }
    }
  }

  // Reconstruct the shortest path
  let path = [];
  let node = endNode;
  while (node !== null) {
    path.unshift(node);
    node = previousNodes.get(node);
  }

  // Return the result
  if (distances.get(endNode) === Infinity) {
    return new DijkstraResult([], -1);
  } else {
    return new DijkstraResult(path, distances.get(endNode));
  }
}

module.exports = {
  Graph,
  DijkstraResult,
  dijkstraShortestPath,
};