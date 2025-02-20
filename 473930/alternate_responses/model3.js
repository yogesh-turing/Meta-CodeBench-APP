class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);

    if (rootA !== rootB) {
      if (this.rank[rootA] < this.rank[rootB]) {
        [rootA, rootB] = [rootB, rootA];
      }
      this.parent[rootB] = rootA;
      if (this.rank[rootA] === this.rank[rootB]) {
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
    if (!this.adjacencyList[node1]) this.addNode(node1);
    if (!this.adjacencyList[node2]) this.addNode(node2);
    
    this.adjacencyList[node1].push({ node: node2, weight });
    this.adjacencyList[node2].push({ node: node1, weight });
  }

  getAllNodes() {
    return Object.keys(this.adjacencyList);
  }

  getAllEdges() {
    const edges = new Set();
    const visited = new Set();

    for (const node in this.adjacencyList) {
      for (const neighbor of this.adjacencyList[node]) {
        const edge = [node, neighbor.node, neighbor.weight]
          .sort((a, b) => a.localeCompare(b))
          .join(',');
        if (!visited.has(edge)) {
          edges.add([node, neighbor.node, neighbor.weight]);
          visited.add(edge);
        }
      }
    }
    return Array.from(edges);
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
    if (this.isEmpty()) return null;
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
    const pq = new PriorityQueue();

    // Initialize distances
    for (let node of graph.getAllNodes()) {
      distances[node] = node === start ? 0 : Infinity;
      previous[node] = null;
      pq.enqueue(node, distances[node]);
    }

    while (!pq.isEmpty()) {
      const current = pq.dequeue().value;
      
      for (const neighbor of graph.adjacencyList[current]) {
        const distance = distances[current] + neighbor.weight;
        
        if (distance < distances[neighbor.node]) {
          distances[neighbor.node] = distance;
          previous[neighbor.node] = current;
          pq.enqueue(neighbor.node, distance);
        }
      }
    }

    return { distances, previous };
  }

  reconstructPath(previous, start, goal) {
    const path = [];
    let current = goal;

    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    return path[0] === start ? path : [];
  }
}

class Kruskal {
  constructor() {}

  minimumSpanningTree(graph) {
    const edges = graph.getAllEdges();
    const nodes = graph.getAllNodes();
    const uf = new UnionFind(nodes.length);
    const nodeToIndex = {};
    const mstEdges = [];
    let totalWeight = 0;

    // Create mapping of node names to indices
    nodes.forEach((node, index) => {
      nodeToIndex[node] = index;
    });

    // Sort edges by weight
    edges.sort((a, b) => a[2] - b[2]);

    for (const [node1, node2, weight] of edges) {
      const index1 = nodeToIndex[node1];
      const index2 = nodeToIndex[node2];

      if (uf.find(index1) !== uf.find(index2)) {
        uf.union(index1, index2);
        mstEdges.push([node1, node2, weight]);
        totalWeight += weight;
      }
    }

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