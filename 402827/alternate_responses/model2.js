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
  const pq = new Map(); // Priority queue implemented as a Map for simplicity
  const visited = new Set();

  // Initialize distances
  for (const node of graph.getAdjList().keys()) {
    distances.set(node, Infinity);
    pq.set(node, Infinity);
  }
  distances.set(startNode, 0);
  pq.set(startNode, 0);

  while (pq.size > 0) {
    // Find node with minimum distance
    let currentNode = null;
    let minDistance = Infinity;
    for (const [node, dist] of pq) {
      if (dist < minDistance) {
        minDistance = dist;
        currentNode = node;
      }
    }

    if (currentNode === null) break;
    if (currentNode === endNode) break;

    // Remove current node from priority queue
    pq.delete(currentNode);
    visited.add(currentNode);

    // Process neighbors
    const neighbors = graph.getAdjList().get(currentNode) || [];
    for (const [neighbor, weight] of neighbors) {
      if (visited.has(neighbor)) continue;

      const newDistance = distances.get(currentNode) + weight;
      if (newDistance < distances.get(neighbor)) {
        distances.set(neighbor, newDistance);
        previousNodes.set(neighbor, currentNode);
        pq.set(neighbor, newDistance);
      }
    }
  }

  // If end node is not reachable
  if (!visited.has(endNode) && endNode !== startNode) {
    return new DijkstraResult([], -1);
  }

  // Reconstruct path
  const path = [];
  let current = endNode;
  while (current !== undefined) {
    path.unshift(current);
    current = previousNodes.get(current);
  }

  // Verify path starts with startNode
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