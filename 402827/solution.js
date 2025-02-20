class Graph {
    constructor() {
      this.adjList = new Map();
    }
  
    /**
     * Adds a directed edge to the graph.
     *
     * @param {number} from - The starting node of the edge
     * @param {number} to - The ending node of the edge
     * @param {number} weight - The weight of the edge
     */
    addEdge(from, to, weight) {
      if (!this.adjList.has(from)) this.adjList.set(from, []);
      if (!this.adjList.has(to)) this.adjList.set(to, []);
      this.adjList.get(from).push([to, weight]);
    }
  
    /**
     * Returns the adjacency list representation of the graph.
     *
     * @returns {Map<number, Array<[number, number]>>} The adjacency list
     */
    getAdjList() {
      return this.adjList;
    }
  }
  
  class DijkstraResult {
    /**
     * Represents the result of Dijkstra's shortest path algorithm.
     *
     * @param {Array<number>} path - The shortest path from start to end node
     * @param {number} distance - The total distance of the shortest path
     */
    constructor(path, distance) {
      this.path = path;
      this.distance = distance;
    }
  }
  
  function dijkstraShortestPath(graph, startNode, endNode) {
    const distances = new Map();
    const previousNodes = new Map();
    const priorityQueue = new PriorityQueue((a, b) => a[0] - b[0]);
    const visited = new Set();
  
    // Initialize all distances to infinity except the startNode
    for (let node of graph.getAdjList().keys()) {
      distances.set(node, Infinity);
    }
    distances.set(startNode, 0);
    priorityQueue.push([0, startNode]);
  
    while (priorityQueue.length > 0) {
      const [currentDistance, currentNode] = priorityQueue.pop();
  
      if (visited.has(currentNode)) continue;
      visited.add(currentNode);
  
      if (currentNode === endNode) break;
  
      const neighbors = graph.getAdjList().get(currentNode) || [];
      for (let [neighborNode, edgeWeight] of neighbors) {
        const newDistance = currentDistance + edgeWeight;
        if (newDistance < distances.get(neighborNode)) {
          distances.set(neighborNode, newDistance);
          previousNodes.set(neighborNode, currentNode);
          priorityQueue.push([newDistance, neighborNode]);
        }
      }
    }
  
    // Reconstruct the path
    const path = [];
    let at = endNode;
    while (at !== undefined) {
      path.unshift(at);
      at = previousNodes.get(at);
    }
  
    if (!path.includes(startNode)) {
      return new DijkstraResult([], -1);
    }
  
    return new DijkstraResult(path, distances.get(endNode) === Infinity ? -1 : distances.get(endNode));
  }
  
  // PriorityQueue helper class for the above algorithm
  class PriorityQueue {
    constructor(compare) {
      this.compare = compare;
      this.items = [];
    }
  
    push(item) {
      this.items.push(item);
      this.items.sort(this.compare);
    }
  
    pop() {
      return this.items.shift();
    }
  
    get length() {
      return this.items.length;
    }
  }
  
  // Export the classes and function for use in other files
  module.exports = {
    Graph,
    DijkstraResult,
    dijkstraShortestPath,
  };