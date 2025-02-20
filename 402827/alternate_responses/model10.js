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

  // Initialize distances and priority queue
  for (const node of adjList.keys()) {
    distances.set(node, Infinity);
  }
  distances.set(startNode, 0);
  priorityQueue.push([startNode, 0]);

  while (priorityQueue.length > 0) {
    // Extract the node with the minimum distance from the priority queue
    priorityQueue.sort((a, b) => a[1] - b[1]);
    const [currentNode, currentDistance] = priorityQueue.shift();

    // If the current node is the end node, we can stop
    if (currentNode === endNode) break;

    // Skip if the current distance is greater than the already known distance
    if (currentDistance > distances.get(currentNode)) continue;

    // Iterate over the neighbors of the current node
    for (const [neighbor, weight] of adjList.get(currentNode)) {
      const distance = currentDistance + weight;

      // If a shorter path to the neighbor is found, update the distance and previous node
      if (distance < distances.get(neighbor)) {
        distances.set(neighbor, distance);
        previousNodes.set(neighbor, currentNode);
        priorityQueue.push([neighbor, distance]);
      }
    }
  }

  // Reconstruct the path by backtracking from the end node
  const path = [];
  let currentNode = endNode;
  while (currentNode !== undefined) {
    path.unshift(currentNode);
    currentNode = previousNodes.get(currentNode);
  }

  // If no path exists, return an empty list and a distance of -1
  if (path[0] !== startNode) return new DijkstraResult([], -1);

  return new DijkstraResult(path, distances.get(endNode));
}

module.exports = {
  Graph,
  DijkstraResult,
  dijkstraShortestPath,
};