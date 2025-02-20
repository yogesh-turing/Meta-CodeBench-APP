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

  // Initialize distances and priority queue
  graph.getAdjList().forEach((_, node) => {
    distances.set(node, Infinity);
  });
  distances.set(startNode, 0);
  priorityQueue.push([startNode, 0]);

  while (priorityQueue.length > 0) {
    // Extract the node with the smallest distance from the priority queue
    const [node, distance] = priorityQueue.shift();

    // If the node is the end node, we can stop the algorithm
    if (node === endNode) break;

    // Process the node's neighbors
    graph.getAdjList().get(node).forEach(([neighbor, weight]) => {
      const newDistance = distance + weight;

      // If a shorter path to the neighbor is found, update the distance and previous node
      if (newDistance < distances.get(neighbor)) {
        distances.set(neighbor, newDistance);
        previousNodes.set(neighbor, node);
        priorityQueue.push([neighbor, newDistance]);
      }
    });

    // Sort the priority queue to ensure the node with the smallest distance is always first
    priorityQueue.sort((a, b) => a[1] - b[1]);
  }

  // Reconstruct the path by backtracking from the end node
  const path = [];
  let currentNode = endNode;
  while (currentNode !== undefined) {
    path.unshift(currentNode);
    currentNode = previousNodes.get(currentNode);
  }

  // If no path exists, return an empty list and a distance of -1
  if (path[0] !== startNode) {
    return new DijkstraResult([], -1);
  }

  return new DijkstraResult(path, distances.get(endNode));
}

module.exports = {
  Graph,
  DijkstraResult,
  dijkstraShortestPath,
};