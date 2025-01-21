import { describe, expect, it, test } from "vitest";
import { bfs, dfs } from ".";

const graph = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: [],
};

describe("Graph Traversal Tests", () => {
  const testCases = [
    {
      name: "DFS and BFS from node A in a connected graph",
      input: { graph, startNode: "A" },
      expectedDFS: ["A", "B", "D", "E", "F", "C"],
      expectedBFS: ["A", "B", "C", "D", "E", "F"],
    },
    {
      name: "DFS and BFS from node B",
      input: { graph, startNode: "B" },
      expectedDFS: ["B", "D", "E", "F"],
      expectedBFS: ["B", "D", "E", "F"],
    },
    {
      name: "DFS and BFS from node C",
      input: { graph, startNode: "C" },
      expectedDFS: ["C", "F"],
      expectedBFS: ["C", "F"],
    },
    {
      name: "DFS and BFS from terminal node F",
      input: { graph, startNode: "F" },
      expectedDFS: ["F"],
      expectedBFS: ["F"],
    },
    {
      name: "DFS and BFS with an empty graph",
      input: { graph: {}, startNode: "A" },
      expectedDFS: [],
      expectedBFS: [],
    },
    {
      name: "DFS and BFS with a non-existent node",
      input: { graph, startNode: "X" },
      expectedDFS: [],
      expectedBFS: [],
    },
  ];

  testCases.forEach(({ name, input, expectedDFS, expectedBFS }) => {
    it(`DFS Test - ${name}`, () => {
      const result = dfs(input.graph, input.startNode);
      expect(result).toEqual(expectedDFS);
    });

    it(`BFS Test - ${name}`, () => {
      const result = bfs(input.graph, input.startNode);
      expect(result).toEqual(expectedBFS);
    });
  });
});