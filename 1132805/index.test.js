const {
    findLargestConnectedComponent
  } = require('./solution');
  
  describe('findLargestConnectedComponent Function', () => {
    test("Graph with a single fully connected component", () => {
      expect(findLargestConnectedComponent({
        "A": ["B", "C"],
        "B": ["A", "D"],
        "C": ["A", "E"],
        "D": ["B"],
        "E": ["C"]
      })).toBe(5);
    });
  
    test("Graph with multiple disconnected components", () => {
      expect(findLargestConnectedComponent({
        "A": ["B"],
        "B": ["A"],
        "C": ["D"],
        "D": ["C"],
        "E": []
      })).toBe(2);
    });
  
    test("Empty graph should return 0", () => {
      expect(findLargestConnectedComponent({})).toBe(0);
    });
  
    test("Graph with a single node and no edges should return 1", () => {
      expect(findLargestConnectedComponent({
        "X": []
      })).toBe(1);
    });
  
    test("Graph with isolated nodes should count them separately", () => {
      expect(findLargestConnectedComponent({
        "A": [],
        "B": [],
        "C": []
      })).toBe(1);
    });
  
    test("Graph with all nodes interconnected", () => {
      expect(findLargestConnectedComponent({
        "A": ["B", "C"],
        "B": ["A", "C"],
        "C": ["A", "B"]
      })).toBe(3);
    });
  
    test("Graph with a long linear chain", () => {
      expect(findLargestConnectedComponent({
        "A": ["B"],
        "B": ["A", "C"],
        "C": ["B", "D"],
        "D": ["C", "E"],
        "E": ["D"]
      })).toBe(5);
    });
  
    test("Graph with a tree-like structure", () => {
      expect(findLargestConnectedComponent({
        "A": ["B", "C"],
        "B": ["A", "D", "E"],
        "C": ["A"],
        "D": ["B"],
        "E": ["B"]
      })).toBe(5);
    });
  
    test("Should throw error for null input", () => {
      expect(() => findLargestConnectedComponent(null)).toThrow("Invalid input: graph must be an adjacency list object");
    });
  
    test("Should throw error for undefined input", () => {
      expect(() => findLargestConnectedComponent(undefined)).toThrow("Invalid input: graph must be an adjacency list object");
    });
  
    test("Should throw error for number input", () => {
      expect(() => findLargestConnectedComponent(42)).toThrow("Invalid input: graph must be an adjacency list object");
    });
  
    test("Should throw error for string input", () => {
      expect(() => findLargestConnectedComponent("graph")).toThrow("Invalid input: graph must be an adjacency list object");
    });
  
    test("Should throw error for array input", () => {
      expect(() => findLargestConnectedComponent(["A", "B", "C"])).toThrow("Invalid input: graph must be an adjacency list object");
    });
  
    test("Should throw error when nodes reference non-array values", () => {
      expect(() => findLargestConnectedComponent({
        "A": "B",
        "B": ["A"]
      })).toThrow("Invalid input: graph must be an adjacency list object");
    });
  
    test("Handles a large linear chain graph efficiently", () => {
      let largeChain = {};
      for (let i = 0; i < 100000; i++) {
        largeChain[i] = [i + 1];
      }
      largeChain[99999] = [];
  
      expect(findLargestConnectedComponent(largeChain)).toBe(100000);
    });
  
    test("Handles a large sparse graph with disconnected nodes", () => {
      let sparseGraph = {};
      for (let i = 0; i < 100000; i++) {
        sparseGraph[i] = [];
      }
  
      expect(findLargestConnectedComponent(sparseGraph)).toBe(1);
    });
  
    test("Handles a fully connected large graph", () => {
      let fullyConnectedGraph = {};
      let nodes = 1000;
  
      // Create a fully connected graph with 1000 nodes
      for (let i = 0; i < nodes; i++) {
        fullyConnectedGraph[i] = [];
        for (let j = 0; j < nodes; j++) {
          if (i !== j) fullyConnectedGraph[i].push(String(j)); // Ensure neighbors are strings
        }
      }
  
      // Log the graph to verify its structure
      console.log("Graph Nodes:", Object.keys(fullyConnectedGraph).length);
      console.log("Sample Node Connections:", fullyConnectedGraph[0].length);
  
      // Expect the largest connected component size to be 1000
      expect(findLargestConnectedComponent(fullyConnectedGraph)).toBe(1000);
    });
  
    test("Detects circular references correctly", () => {
      let cyclicGraph = {
        "A": ["B"],
        "B": ["A", "C"],
        "C": ["B", "D"],
        "D": ["C", "A"]
      };
  
      expect(findLargestConnectedComponent(cyclicGraph)).toBe(4);
    });
  
  });
  