class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA !== rootB) {
      if (this.rank[rootA] > this.rank[rootB]) {
        this.parent[rootB] = rootA;
      } else if (this.rank[rootA] < this.rank[rootB]) {
        this.parent[rootA] = rootB;
      } else {
        this.parent[rootB] = rootA;
        this.rank[rootA]++;
      }
    }
  }
}

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addNode(node) {
    if (!this.adjacencyList[node]) {
      this.adjacencyList[node] = [];
    }
  }

  addEdge(node1, node2, weight) {
    if (this.adjacencyList[node1] && this.adjacencyList[node2]) {
      this.adjacencyList[node1].push({ node: node2, weight });
      this.adjacencyList[node2].push({ node: node1, weight });
    }
  }

  getAllNodes() {
    return Object.keys(this.adjacencyList);
  }

  getAllEdges() {
    const edges = new Set();
    for (const node in this.adjacencyList) {
      for (const neighbor of this.adjacencyList[node]) {
        const edge = [node, neighbor.node, neighbor.weight].sort();
        edges.add(JSON.stringify(edge));
      }
    }
    return Array.from(edges).map((edge) => JSON.parse(edge));
  }
}

class DFS {
  constructor() {}

  findConnectedComponents(graph) {
    const visited = new Set();
    const components = [];
    for (const node of graph.getAllNodes()) {
      if (!visited.has(node)) {
        const component = [];
        this.dfsVisit(graph, node, visited, component);
        components.push(component);
      }
    }
    return components;
  }

  dfsVisit(graph, currentNode, visited, component) {
    visited.add(currentNode);
    component.push(currentNode);
    const neighbors = graph.adjacencyList[currentNode];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.node)) {
        this.dfsVisit(graph, neighbor.node, visited, component);
      }
    }
  }
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }
  enqueue(value, priority) {
    this.values.push({ value, priority });
    this.bubbleUp();
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
  isEmpty() {
    return this.values.length === 0;
  }
}

class Dijkstra {
  constructor() {}

  shortestPaths(graph, start) {
    const distances = {};
    const previous = {};
    const priorityQueue = new PriorityQueue();
    for (const node of graph.getAllNodes()) {
      distances[node] = Infinity;
      previous[node] = null;
    }
    distances[start] = 0;
    priorityQueue.enqueue(start, 0);

    while (!priorityQueue.isEmpty()) {
      const { value: currentNode, priority: currentDistance } =
        priorityQueue.dequeue();
      if (currentDistance > distances[currentNode]) continue;

      for (const neighbor of graph.adjacencyList[currentNode]) {
        const distance = currentDistance + neighbor.weight;
        if (distance < distances[neighbor.node]) {
          distances[neighbor.node] = distance;
          previous[neighbor.node] = currentNode;
          priorityQueue.enqueue(neighbor.node, distance);
        }
      }
    }
    return { distances, previous };
  }

  reconstructPath(previous, start, goal) {
    const path = [];
    let currentNode = goal;
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }
    return path;
  }
}

class Kruskal {
  constructor() {}
  minimumSpanningTree(graph) {
    const mstEdges = [];
    const edges = graph.getAllEdges();
    edges.sort((a, b) => a[2] - b[2]);
    const unionFind = new UnionFind(graph.getAllNodes().length);

    for (const edge of edges) {
      const [node1, node2, weight] = edge;
      if (unionFind.find(node1) !== unionFind.find(node2)) {
        unionFind.union(node1, node2);
        mstEdges.push(edge);
      }
    }
    const totalWeight = mstEdges.reduce((acc, edge) => acc + edge[2], 0);
    return { mstEdges, totalWeight };
  }
}

module.exports = {
  UnionFind,
  Graph,
  DFS,
  Dijkstra,
  Kruskal,
  PriorityQueue,
};