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

class MinPriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(node, priority) {
    this.values.push([node, priority]);
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a[1] - b[1]);
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

function dijkstraShortestPath(graph, startNode, endNode) {
  const distances = new Map();
  const previousNodes = new Map();
  const pq = new MinPriorityQueue();
  const adjList = graph.getAdjList();

  // Initialize distances map
  for (let node of adjList.keys()) {
    distances.set(node, node === startNode ? 0 : Infinity);
    previousNodes.set(node, null);
  }

  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    const [currentNode, currentDistance] = pq.dequeue();

    if (currentNode === endNode) {
      break;
    }

    if (currentDistance > distances.get(currentNode)) {
      continue;
    }

    const neighbors = adjList.get(currentNode) || [];
    for (const [neighbor, weight] of neighbors) {
      const distance = distances.get(currentNode) + weight;

      if (distance < distances.get(neighbor)) {
        distances.set(neighbor, distance);
        previousNodes.set(neighbor, currentNode);
        pq.enqueue(neighbor, distance);
      }
    }
  }

  // If endNode is unreachable
  if (distances.get(endNode) === Infinity) {
    return new DijkstraResult([], -1);
  }

  // Reconstruct path
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = previousNodes.get(current);
  }

  return new DijkstraResult(path, distances.get(endNode));
}

module.exports = {
  Graph,
  DijkstraResult,
  dijkstraShortestPath,
};