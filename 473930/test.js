const {
  UnionFind,
  Graph,
  DFS,
  Dijkstra,
  Kruskal,
  PriorityQueue,
} = require("./solution");

describe("Union-Find", () => {
  test("should initialize parent and rank arrays correctly", () => {
    const uf = new UnionFind(5);
    expect(uf.parent).toEqual([0, 1, 2, 3, 4]);
    expect(uf.rank).toEqual([0, 0, 0, 0, 0]);
  });

  test("should correctly union two different elements", () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);
    expect(uf.find(0)).toEqual(uf.find(1));
  });

  test("should not change root if elements are already connected", () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);
    const rootBefore = uf.find(0);
    uf.union(0, 1);
    const rootAfter = uf.find(0);
    expect(rootBefore).toEqual(rootAfter);
  });

  test("should perform path compression correctly", () => {
    const uf = new UnionFind(6);
    uf.union(0, 1);
    uf.union(1, 2);
    uf.union(2, 3);
    uf.find(3);
    expect(uf.find(3)).toEqual(uf.find(0));
  });

  test("should perform union by rank correctly", () => {
    const uf = new UnionFind(5);
    uf.union(0, 1);
    uf.union(2, 3);
    uf.union(0, 2);
    const root = uf.find(0);
    expect(uf.rank[root]).toBeGreaterThanOrEqual(1);
  });

  test("should handle consecutive unions on different disjoint sets", () => {
    const uf = new UnionFind(7);
    uf.union(0, 1);
    uf.union(2, 3);
    uf.union(4, 5);
    expect(uf.find(0)).toEqual(uf.find(1));
    expect(uf.find(2)).toEqual(uf.find(3));
    expect(uf.find(4)).toEqual(uf.find(5));
    expect(uf.find(6)).toBe(6);
  });
});

describe("Graph Operations", () => {
  test("should add a node correctly", () => {
    const graph = new Graph();
    graph.addNode("A");
    expect(graph.adjacencyList).toHaveProperty("A");
    expect(graph.adjacencyList["A"]).toEqual([]);
  });

  test("should add an edge between two new nodes", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addEdge("A", "B", 2);
    expect(graph.adjacencyList["A"]).toEqual([{ node: "B", weight: 2 }]);
    expect(graph.adjacencyList["B"]).toEqual([{ node: "A", weight: 2 }]);
  });

  test("should return all unique node names for the getAllNodes call", () => {
    const graph = new Graph();
    graph.addNode("X");
    graph.addNode("Y");
    graph.addEdge("X", "Y", 1);
    graph.addNode("Z");
    graph.addEdge("Y", "Z", 2);
    graph.addNode("W");
    const nodes = graph.getAllNodes();
    expect(nodes.sort()).toEqual(["W", "X", "Y", "Z"].sort());
  });
});

describe("DFS", () => {
  let dfs;
  beforeEach(() => {
    dfs = new DFS();
  });
  test("should return an empty array when finding connected components on an empty graph", () => {
    const graph = new Graph();
    const components = dfs.findConnectedComponents(graph);
    expect(components).toEqual([]);
  });

  test("should return a single-node component when finding connected components on a single-node graph", () => {
    const graph = new Graph();
    graph.addNode("Solo");
    const components = dfs.findConnectedComponents(graph);
    expect(components).toEqual([["Solo"]]);
  });

  test("should return one component for a fully connected graph", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addEdge("A", "B", 1);
    graph.addNode("C");
    graph.addEdge("B", "C", 2);
    graph.addNode("D");
    graph.addEdge("C", "D", 3);
    const components = dfs.findConnectedComponents(graph);
    expect(components.length).toBe(1);
    expect(components[0].sort()).toEqual(["A", "B", "C", "D"].sort());
  });

  test("should return multiple components for a partially disconnected graph", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addEdge("A", "B", 1);
    graph.addNode("C"); // isolated
    graph.addNode("D");
    graph.addNode("E");
    graph.addEdge("D", "E", 2);
    const components = dfs.findConnectedComponents(graph);
    const sortedComponents = components.map((comp) => comp.sort()).sort();
    const expected = [["A", "B"], ["C"], ["D", "E"]]
      .map((comp) => comp.sort())
      .sort();
    expect(sortedComponents).toEqual(expected);
  });
});

describe("Dijkstra", () => {
  let dj;
  beforeEach(() => {
    dj = new Dijkstra();
  });

  test("should return 0 distance to itself for a single-node graph", () => {
    const graph = new Graph();
    graph.addNode("Solo");
    const { distances, previous } = dj.shortestPaths(graph, "Solo");
    expect(distances["Solo"]).toBe(0);
    expect(previous["Solo"]).toBeNull();
  });
  test("should choose the best path in a graph with multiple edges", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("C");
    graph.addEdge("A", "B", 1);
    graph.addEdge("B", "C", 2);
    graph.addEdge("A", "C", 5);
    const { distances } = dj.shortestPaths(graph, "A");
    expect(distances["C"]).toBe(3); // not 5
  });
});

describe("Kruskal Tests (Minimum Spanning Tree)", () => {
  let kruskal;
  beforeEach(() => {
    kruskal = new Kruskal();
  });

  test("should return an empty MST for a single-node graph", () => {
    const graph = new Graph();
    graph.addNode("Solo");
    const { mstEdges, totalWeight } = kruskal.minimumSpanningTree(graph);
    expect(mstEdges).toEqual([]);
    expect(totalWeight).toBe(0);
  });

  test("should compute MST correctly for a basic triangle graph", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("C");
    graph.addEdge("A", "B", 1);
    graph.addEdge("B", "C", 2);
    graph.addEdge("A", "C", 3);
    const { mstEdges, totalWeight } = kruskal.minimumSpanningTree(graph);
    expect(mstEdges.length).toBe(2);
    expect(totalWeight).toBe(3);
    const edgeSet = new Set(mstEdges.map((e) => `${e[0]}-${e[1]}-${e[2]}`));
    expect(edgeSet).toContain("A-B-1");
    expect(edgeSet).toContain("B-C-2");
  });

  test("should produce MST for each component in a disconnected graph", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addEdge("A", "B", 5);
    graph.addNode("C");
    graph.addNode("D");
    graph.addEdge("C", "D", 2);
    const { mstEdges, totalWeight } = kruskal.minimumSpanningTree(graph);
    expect(mstEdges.length).toBe(2);
    expect(totalWeight).toBe(7);
  });

  test("should include all nodes in the MST if the graph is connected", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("C");
    graph.addNode("D");
    graph.addEdge("A", "B", 1);
    graph.addEdge("A", "C", 4);
    graph.addEdge("B", "C", 2);
    graph.addEdge("B", "D", 3);
    graph.addEdge("C", "D", 5);
    const { mstEdges, totalWeight } = kruskal.minimumSpanningTree(graph);

    expect(mstEdges.length).toBe(3);
    expect(totalWeight).toBe(6);
    const nodesInMST = new Set(mstEdges.flatMap(([n1, n2]) => [n1, n2]));
    expect(nodesInMST.size).toBe(4);
  });
});

describe("PriorityQueue", () => {
  test("should properly sink down with left child swap", () => {
    const pq = new PriorityQueue();
    pq.enqueue("A", 5);
    pq.enqueue("B", 3);
    pq.enqueue("C", 7);

    const min = pq.dequeue();
    expect(min.value).toBe("B");
    expect(pq.values[0].value).toBe("A");
    expect(pq.values[0].priority).toBe(5);
  });

  test("should properly sink down with right child swap", () => {
    const pq = new PriorityQueue();
    pq.enqueue("A", 5);
    pq.enqueue("B", 6);
    pq.enqueue("C", 2);

    const min = pq.dequeue();
    expect(min.value).toBe("C");
    expect(pq.values[0].value).toBe("A");
    expect(pq.values[0].priority).toBe(5);
  });

  test("should handle multiple levels of sinking with both left and right swaps", () => {
    const pq = new PriorityQueue();
    pq.enqueue("A", 10);
    pq.enqueue("B", 8);
    pq.enqueue("C", 9);
    pq.enqueue("D", 4);
    pq.enqueue("E", 5);
    pq.enqueue("F", 3);
    pq.enqueue("G", 7);

    const min1 = pq.dequeue();
    expect(min1.value).toBe("F");

    const min2 = pq.dequeue();
    expect(min2.value).toBe("D");

    expect(pq.values[0].priority).toBeLessThan(pq.values[1].priority);
    expect(pq.values[0].priority).toBeLessThan(pq.values[2].priority);
  });

  test("should maintain heap property after multiple operations", () => {
    const pq = new PriorityQueue();
    const elements = [
      { value: "A", priority: 5 },
      { value: "B", priority: 3 },
      { value: "C", priority: 7 },
      { value: "D", priority: 1 },
      { value: "E", priority: 4 },
    ];

    elements.forEach((el) => pq.enqueue(el.value, el.priority));

    let prevPriority = -Infinity;
    while (!pq.isEmpty()) {
      const current = pq.dequeue();
      expect(current.priority).toBeGreaterThanOrEqual(prevPriority);
      prevPriority = current.priority;

      for (let i = 0; i < pq.values.length; i++) {
        const leftIdx = 2 * i + 1;
        const rightIdx = 2 * i + 2;

        if (leftIdx < pq.values.length) {
          expect(pq.values[i].priority).toBeLessThanOrEqual(
            pq.values[leftIdx].priority
          );
        }
        if (rightIdx < pq.values.length) {
          expect(pq.values[i].priority).toBeLessThanOrEqual(
            pq.values[rightIdx].priority
          );
        }
      }
    }
  });

  test("should handle edge case of sinking with only left child", () => {
    const pq = new PriorityQueue();
    pq.enqueue("A", 5);
    pq.enqueue("B", 3);

    const min = pq.dequeue();
    expect(min.value).toBe("B");
    expect(pq.values[0].value).toBe("A");
    expect(pq.values.length).toBe(1);
  });
});

describe("Feature based Test", () => {
  test("Should detect isolated streetlight clusters during a power outage", () => {
    const grid = new Graph();
    grid.addNode("T1");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("L3");
    grid.addEdge("T1", "L1", 5);
    grid.addEdge("L1", "L2", 2);
    grid.addEdge("L2", "L3", 2);

    grid.addNode("L4");
    grid.addNode("L5");
    grid.addNode("L6");
    grid.addEdge("L4", "L5", 2);
    grid.addEdge("L5", "L6", 2);

    const dfs = new DFS();
    const components = dfs.findConnectedComponents(grid);

    expect(components.length).toBe(2);
    expect(components[0].length).toBe(4);
    expect(components[1].length).toBe(3);
  });

  test("Should determine if disconnected lights can be reconnected", () => {
    const grid = new Graph();
    grid.addNode("T1");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("T2");
    grid.addNode("L3");
    grid.addNode("L4");
    grid.addEdge("T1", "L1", 5);
    grid.addEdge("L1", "L2", 2);
    grid.addEdge("T2", "L3", 5);
    grid.addEdge("L3", "L4", 2);
    grid.addEdge("L2", "L3", 3);

    const uf = new UnionFind(6);
    const nodeMap = { T1: 0, L1: 1, L2: 2, T2: 3, L3: 4, L4: 5 };

    uf.union(nodeMap.T1, nodeMap.L1);
    uf.union(nodeMap.L1, nodeMap.L2);
    uf.union(nodeMap.L2, nodeMap.L3);

    expect(uf.find(nodeMap.L4)).not.toBe(uf.find(nodeMap.T1));
    uf.union(nodeMap.L3, nodeMap.L4);
    expect(uf.find(nodeMap.L4)).toBe(uf.find(nodeMap.T1));
  });

  test("Should find the shortest maintenance route to a repair location", () => {
    const grid = new Graph();
    grid.addNode("Depot");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("L3");
    grid.addNode("L4");
    grid.addEdge("Depot", "L1", 2);
    grid.addEdge("L1", "L2", 3);
    grid.addEdge("L2", "L3", 1);
    grid.addEdge("L1", "L4", 5);
    grid.addEdge("L4", "L3", 2);

    const dijkstra = new Dijkstra();
    const { distances, previous } = dijkstra.shortestPaths(grid, "Depot");
    const path = dijkstra.reconstructPath(previous, "Depot", "L3");

    expect(path).toEqual(["Depot", "L1", "L2", "L3"]);
    expect(distances["L3"]).toBe(6);
  });

  test("Should optimize power distribution", () => {
    const grid = new Graph();
    grid.addNode("T1");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("L3");
    grid.addNode("L4");
    grid.addEdge("T1", "L1", 10);
    grid.addEdge("L1", "L2", 8);
    grid.addEdge("L2", "L3", 15);
    grid.addEdge("T1", "L4", 5);
    grid.addEdge("L4", "L3", 6);

    const kruskal = new Kruskal();
    const { mstEdges, totalWeight } = kruskal.minimumSpanningTree(grid);

    expect(totalWeight).toBeLessThan(33);
    expect(mstEdges.length).toBe(4);
  });

  test("Should balance power load between multiple transformers", () => {
    const grid = new Graph();
    grid.addNode("T1");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("T2");
    grid.addNode("L3");
    grid.addNode("L4");
    grid.addEdge("T1", "L1", 5);
    grid.addEdge("T1", "L2", 8);
    grid.addEdge("T2", "L3", 4);
    grid.addEdge("T2", "L4", 6);
    grid.addEdge("L2", "L3", 3);

    const kruskal = new Kruskal();
    const { mstEdges } = kruskal.minimumSpanningTree(grid);

    const t1Connections = mstEdges.filter(
      (edge) => edge[0] === "T1" || edge[1] === "T1"
    );
    const t2Connections = mstEdges.filter(
      (edge) => edge[0] === "T2" || edge[1] === "T2"
    );

    expect(t1Connections.length).toBeGreaterThan(0);
    expect(t2Connections.length).toBeGreaterThan(0);
  });

  test("Should identify the fastest response path for multiple outages", () => {
    const grid = new Graph();
    grid.addNode("Depot");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("L3");
    grid.addNode("L4");
    grid.addEdge("Depot", "L1", 2);
    grid.addEdge("L1", "L2", 3);
    grid.addEdge("L2", "L3", 4);
    grid.addEdge("L1", "L4", 1);
    grid.addEdge("L4", "L3", 5);

    const dijkstra = new Dijkstra();
    const { distances } = dijkstra.shortestPaths(grid, "Depot");

    expect(distances["L2"]).toBeLessThan(distances["L3"]);
    expect(distances["L4"]).toBeLessThan(distances["L3"]);
  });

  test("Should ensure connectivity remains after a single edge failure", () => {
    const grid = new Graph();
    grid.addNode("T1");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("L3");
    grid.addNode("L4");
    grid.addEdge("T1", "L1", 3);
    grid.addEdge("L1", "L2", 2);
    grid.addEdge("L2", "L3", 4);
    grid.addEdge("T1", "L4", 5);
    grid.addEdge("L4", "L3", 3);

    const dfs = new DFS();
    const initialComponents = dfs.findConnectedComponents(grid);

    grid.adjacencyList["L1"] = grid.adjacencyList["L1"].filter(
      (e) => e.node !== "L2"
    );
    grid.adjacencyList["L2"] = grid.adjacencyList["L2"].filter(
      (e) => e.node !== "L1"
    );

    const afterFailureComponents = dfs.findConnectedComponents(grid);
    expect(afterFailureComponents.length).toBe(initialComponents.length);
  });

  test("Should efficiently integrate new streetlights into the network", () => {
    const grid = new Graph();
    grid.addNode("T1");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("L3");
    grid.addNode("L4");
    grid.addEdge("T1", "L1", 4);
    grid.addEdge("L1", "L2", 3);
    grid.addEdge("L2", "L3", 5);
    grid.addEdge("L3", "L4", 2);
    grid.addEdge("L1", "L4", 7);

    const kruskal = new Kruskal();
    const { mstEdges } = kruskal.minimumSpanningTree(grid);

    expect(mstEdges.length).toBe(4);
    const totalNewConnections = mstEdges.filter(
      (edge) =>
        edge[0] === "L3" ||
        edge[1] === "L3" ||
        edge[0] === "L4" ||
        edge[1] === "L4"
    ).length;
    expect(totalNewConnections).toBeGreaterThan(0);
  });

  test("Should minimize total power line distance for optimized grid efficiency", () => {
    const grid = new Graph();
    grid.addNode("T1");
    grid.addNode("L1");
    grid.addNode("L2");
    grid.addNode("L3");
    grid.addNode("L4");
    grid.addEdge("T1", "L1", 5);
    grid.addEdge("L1", "L2", 3);
    grid.addEdge("L2", "L3", 4);
    grid.addEdge("L3", "L4", 2);
    grid.addEdge("L1", "L3", 7);
    grid.addEdge("L2", "L4", 6);

    const kruskal = new Kruskal();
    const { mstEdges, totalWeight } = kruskal.minimumSpanningTree(grid);

    expect(mstEdges.length).toBe(4);
    expect(totalWeight).toBeLessThan(27);
  });

  test("Should detect and reconnect partial outages using DFS and Union-Find", () => {
    const graph = new Graph();
    graph.addNode("T1");
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("T2");
    graph.addNode("C");
    graph.addNode("D");
    graph.addNode("E");
    graph.addEdge("T1", "A", 1);
    graph.addEdge("T1", "B", 1);
    graph.addEdge("T2", "C", 1);
    graph.addEdge("T2", "D", 1);
    graph.addEdge("T2", "E", 1);
    graph.addEdge("T1", "T2", 5);

    graph.adjacencyList["T1"] = graph.adjacencyList["T1"].filter(
      (e) => e.node !== "T2"
    );
    graph.adjacencyList["T2"] = graph.adjacencyList["T2"].filter(
      (e) => e.node !== "T1"
    );

    const dfs = new DFS();
    const componentsBefore = dfs.findConnectedComponents(graph);
    expect(componentsBefore).toHaveLength(2);

    const allNodes = graph.getAllNodes();
    const uf = new UnionFind(allNodes.length);
    const nodeIndexMap = {};
    allNodes.forEach((node, i) => (nodeIndexMap[node] = i));

    const allEdges = graph.getAllEdges();
    for (const [n1, n2] of allEdges) {
      uf.union(nodeIndexMap[n1], nodeIndexMap[n2]);
    }

    const t1Root = uf.find(nodeIndexMap["T1"]);
    const t2Root = uf.find(nodeIndexMap["T2"]);
    expect(t1Root).not.toEqual(t2Root);
  });
  test("Should restore connectivity by adding a new power line", () => {
    const graph = new Graph();
    graph.addNode("T1");
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("T2");
    graph.addNode("C");
    graph.addNode("D");
    graph.addNode("E");
    graph.addEdge("T1", "A", 1);
    graph.addEdge("T1", "B", 1);
    graph.addEdge("T2", "C", 1);
    graph.addEdge("T2", "D", 1);
    graph.addEdge("T2", "E", 1);
    const dfs = new DFS();
    let components = dfs.findConnectedComponents(graph);
    expect(components).toHaveLength(2);

    graph.addEdge("B", "T2", 2);

    components = dfs.findConnectedComponents(graph);
    expect(components).toHaveLength(1);

    const allNodes = graph.getAllNodes();
    const uf = new UnionFind(allNodes.length);
    const nodeIndexMap = {};
    allNodes.forEach((node, i) => (nodeIndexMap[node] = i));
    for (const [n1, n2] of graph.getAllEdges()) {
      uf.union(nodeIndexMap[n1], nodeIndexMap[n2]);
    }
    expect(uf.find(nodeIndexMap["T1"])).toEqual(uf.find(nodeIndexMap["T2"]));
  });
  test("Should identify the fastest repair route using Dijkstra's algorithm", () => {
    const graph = new Graph();
    graph.addNode("M1");
    graph.addNode("A");
    graph.addNode("M2");
    graph.addEdge("M1", "A", 10);
    graph.addEdge("A", "M2", 10);
    graph.addEdge("M1", "M2", 5);

    const dj = new Dijkstra();
    const { distances, previous } = dj.shortestPaths(graph, "M1");

    expect(distances["M2"]).toBe(5);
    const path = dj.reconstructPath(previous, "M1", "M2");
    expect(path).toEqual(["M1", "M2"]);
  });

  test("Should compute the minimum spanning tree for a fully connected network", () => {
    const graph = new Graph();
    graph.addNode("Lamp1");
    graph.addNode("Lamp2");
    graph.addNode("Lamp3");
    graph.addNode("Lamp4");
    graph.addEdge("Lamp1", "Lamp2", 1);
    graph.addEdge("Lamp2", "Lamp3", 2);
    graph.addEdge("Lamp1", "Lamp3", 2);
    graph.addEdge("Lamp3", "Lamp4", 3);
    graph.addEdge("Lamp2", "Lamp4", 10);

    const kruskal = new Kruskal();
    const { mstEdges, totalWeight } = kruskal.minimumSpanningTree(graph);

    expect(mstEdges).toHaveLength(3);
    expect(totalWeight).toBe(6);
  });

  test("Should optimize high-load edges in a mixed network using Kruskal's MST", () => {
    const graph = new Graph();
    graph.addNode("A");
    graph.addNode("B");
    graph.addNode("C");
    graph.addNode("D");
    graph.addNode("E");
    graph.addEdge("A", "B", 10);
    graph.addEdge("B", "C", 1);
    graph.addEdge("C", "D", 1);
    graph.addEdge("A", "C", 50);
    graph.addEdge("B", "D", 100);
    graph.addEdge("D", "E", 2);
    graph.addEdge("C", "E", 2);

    const kruskal = new Kruskal();
    const { mstEdges, totalWeight } = kruskal.minimumSpanningTree(graph);

    expect(mstEdges).toHaveLength(4);
    expect(totalWeight).toBe(14);
  });
});