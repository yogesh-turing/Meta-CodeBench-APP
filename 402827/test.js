const { Graph, dijkstraShortestPath, DijkstraResult  } = require('./solution');

describe('Dijkstra Algorithm', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
  });

  test('Positive case: Shortest path exists', () => {
    graph.addEdge(0, 1, 4);
    graph.addEdge(0, 2, 1);
    graph.addEdge(2, 1, 2);
    graph.addEdge(1, 3, 5);
    graph.addEdge(2, 3, 8);

    const result = dijkstraShortestPath(graph, 0, 3);

    expect(result.path).toEqual([0, 2, 1, 3]);
    expect(result.distance).toBe(8);
  });

  test('Negative case: No path exists', () => {
    graph.addEdge(0, 1, 4);
    graph.addEdge(1, 2, 3);
    // No connection to node 3

    const result = dijkstraShortestPath(graph, 0, 3);

    expect(result.path).toEqual([]);
    expect(result.distance).toBe(-1);
  });

  test('Edge case: Single node', () => {
    graph.addEdge(0, 0, 0);

    const result = dijkstraShortestPath(graph, 0, 0);

    expect(result.path).toEqual([0]);
    expect(result.distance).toBe(0);
  });

  test('Edge case: Two disconnected nodes', () => {
    graph.addEdge(0, 1, 5);
    graph.addEdge(2, 3, 10);

    const result = dijkstraShortestPath(graph, 0, 3);

    expect(result.path).toEqual([]);
    expect(result.distance).toBe(-1);
  });

  test('Edge case: Negative weights not supported', () => {
    graph.addEdge(0, 1, -4);
    graph.addEdge(1, 2, 2);

    const result = dijkstraShortestPath(graph, 0, 2);

    // Check that distance is not equal to 2 as Dijkstra does not support negative weights
    expect(result.distance).not.toBe(2);
  });

  test('Edge case: Start and end same node', () => {
    graph.addEdge(0, 1, 4);

    const result = dijkstraShortestPath(graph, 0, 0);

    expect(result.path).toEqual([0]);
    expect(result.distance).toBe(0);
  });

  test('Null graph', () => {
    expect(() => {
      dijkstraShortestPath(null, 0, 3);
    }).toThrowError();
  });

  test('Empty graph', () => {
    const result = dijkstraShortestPath(graph, 0, 3);

    expect(result.path).toEqual([]);
    expect(result.distance).toBe(-1);
  });

  test('Graph with multiple paths', () => {
    graph.addEdge(0, 1, 2);
    graph.addEdge(1, 2, 2);
    graph.addEdge(0, 2, 5);
    graph.addEdge(2, 3, 1);

    const result = dijkstraShortestPath(graph, 0, 3);

    expect(result.path).toEqual([0, 1, 2, 3]);
    expect(result.distance).toBe(5);
  });

  test('Graph with self loop', () => {
    graph.addEdge(0, 0, 3);

    const result = dijkstraShortestPath(graph, 0, 0);

    expect(result.path).toEqual([0]);
    expect(result.distance).toBe(0);
  });

  test('Graph with multiple edges between same nodes', () => {
    graph.addEdge(0, 1, 4);
    graph.addEdge(0, 1, 2);
    graph.addEdge(1, 2, 3);

    const result = dijkstraShortestPath(graph, 0, 2);

    expect(result.path).toEqual([0, 1, 2]);
    expect(result.distance).toBe(5);
  });

  test('Graph with cycle', () => {
    graph.addEdge(0, 1, 2);
    graph.addEdge(1, 2, 3);
    graph.addEdge(2, 0, 1);
    graph.addEdge(2, 3, 4);

    const result = dijkstraShortestPath(graph, 0, 3);

    expect(result.path).toEqual([0, 1, 2, 3]);
    expect(result.distance).toBe(9);
  });
});