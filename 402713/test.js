const { WirelessChannelAllocator } = require('./solution.js');

describe('WirelessChannelAllocator', () => {
  test('testChain', () => {
    const matrix = [
      [false, true, false],
      [true, false, true],
      [false, true, false],
    ];
    const expected = 2;
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testCycle4', () => {
    const matrix = [
      [false, true, false, true],
      [true, false, true, false],
      [false, true, false, true],
      [true, false, true, false],
    ];
    const expected = 2;
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testTriangle', () => {
    const matrix = [
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ];
    const expected = 3;
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testInvalidMatrix', () => {
    const matrix = [
      [false, true],
      [true, false],
      [false, false],
    ];
    const expected = -1;
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testEmptyMatrix', () => {
    const matrix = [];
    const expected = -1;
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testSingleNode', () => {
    const matrix = [
      [false],
    ];
    const expected = 1;
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testStarGraph', () => {
    const matrix = [
      [false, true, true, true, true],
      [true, false, false, false, false],
      [true, false, false, false, false],
      [true, false, false, false, false],
      [true, false, false, false, false],
    ];
    const expected = 2;
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testNullMatrix', () => {
    const matrix = null;
    const expected = -1;
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });
  test('testCompleteGraph', () => {
    // Complete graph with 4 nodes: every node is connected to every other node
    const matrix = [
      [false, true, true, true],
      [true, false, true, true],
      [true, true, false, true],
      [true, true, true, false]
    ];
    const expected = 4; // A complete graph with n nodes requires n colors
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testBipartiteGraph', () => {
    // Bipartite graph with 4 nodes: 2 sets of 2 nodes with edges between sets
    const matrix = [
      [false, true, false, true],
      [true, false, true, false],
      [false, true, false, true],
      [true, false, true, false]
    ];
    const expected = 2; // Bipartite graphs can be colored with 2 colors
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testDisconnectedGraph', () => {
    // Disconnected graph with 4 nodes: two separate pairs of connected nodes
    const matrix = [
      [false, true, false, false],
      [true, false, false, false],
      [false, false, false, true],
      [false, false, true, false]
    ];
    const expected = 2; // Each component is a bipartite graph
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testCycleGraph', () => {
    // Cycle graph with 5 nodes: 5-cycle
    const matrix = [
      [false, true, false, false, true],
      [true, false, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, true],
      [true, false, false, true, false]
    ];
    const expected = 3; // Odd cycles require 3 colors
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });

  test('testEmptyGraph', () => {
    // Empty graph with no nodes
    const matrix = [];
    const expected = -1; // Invalid input
    const result = WirelessChannelAllocator.minChannels(matrix);
    expect(result).toBe(expected);
  });
});