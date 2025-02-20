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
    constructor(path, distance) {
      this.path = path;
      this.distance = distance;
    }
  }
  
  function dijkstraShortestPath(graph, startNode, endNode) {
    const distances = new Map();
    const previousNodes = new Map();
    const pq = new PriorityQueue((a, b) => a[1] - b[1]); // [node, distance]
    const visited = new Set();
  
    // Initialize distances
    for (let node of graph.getAdjList().keys()) {
      distances.set(node, Infinity);
    }
    distances.set(startNode, 0);
    pq.push([startNode, 0]);
  
    while (pq.length > 0) {
      const [currentNode, currentDistance] = pq.pop();
  
      if (currentNode === endNode) {
        break;
      }
  
      if (visited.has(currentNode)) {
        continue;
      }
      visited.add(currentNode);
  
      const neighbors = graph.getAdjList().get(currentNode) || [];
      for (let [nextNode, weight] of neighbors) {
        if (!visited.has(nextNode)) {
          const newDistance = currentDistance + weight;
          if (newDistance < distances.get(nextNode)) {
            distances.set(nextNode, newDistance);
            previousNodes.set(nextNode, currentNode);
            pq.push([nextNode, newDistance]);
          }
        }
      }
    }
  
    // If end node was not reached
    if (distances.get(endNode) === Infinity) {
      return new DijkstraResult([], -1);
    }
  
    // Reconstruct path
    const path = [];
    let current = endNode;
    while (current !== undefined) {
      path.unshift(current);
      current = previousNodes.get(current);
    }
  
    return new DijkstraResult(path, distances.get(endNode));
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
  
  // Corrected Export Statement - Now Exporting All Classes & Functions
  module.exports = { Graph, DijkstraResult, dijkstraShortestPath, PriorityQueue };