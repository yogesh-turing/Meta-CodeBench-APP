const { FenwickTree } = require('./solution');

describe('Fenwick Tree Tests', () => {
  let fenwickTree;

  beforeEach(() => {
    fenwickTree = new FenwickTree(10); // Initialize the Fenwick Tree with size 10
  });

  test('Update and query correctly', () => {
    fenwickTree.update(1, 5);
    fenwickTree.update(3, 7);
    fenwickTree.update(5, 6);

    expect(fenwickTree.query(5)).toBe(18);
    expect(fenwickTree.rangeQuery(2, 5)).toBe(13);
  });

  test('Range query works for positive case', () => {
    fenwickTree.update(1, 5);
    fenwickTree.update(3, 7);
    fenwickTree.update(5, 6);

    expect(fenwickTree.rangeQuery(1, 3)).toBe(12);
    expect(fenwickTree.rangeQuery(2, 5)).toBe(13);
    expect(fenwickTree.rangeQuery(1, 5)).toBe(18);
  });

  test('Update with negative value', () => {
    fenwickTree.update(2, -5);
    fenwickTree.update(4, -3);

    expect(fenwickTree.query(2)).toBe(-5);
    expect(fenwickTree.query(4)).toBe(-8);
  });

  test('Edge case update at first index', () => {
    fenwickTree.update(1, 10);
    expect(fenwickTree.query(1)).toBe(10);
  });

  test('Range query on entire range', () => {
    fenwickTree.update(1, 3);
    fenwickTree.update(2, 5);
    fenwickTree.update(3, 7);
    fenwickTree.update(4, 9);
    expect(fenwickTree.rangeQuery(1, 4)).toBe(24);
  });

  test('Update out of bounds throws error', () => {
    expect(() => fenwickTree.update(0, 5)).toThrow('Index out of bounds.');
    expect(() => fenwickTree.update(11, 5)).toThrow('Index out of bounds.');
  });

  test('Invalid range query throws error', () => {
    expect(() => fenwickTree.rangeQuery(5, 2)).toThrow('Invalid range.');
  });

  test('Query on empty tree', () => {
    const emptyTree = new FenwickTree(5);
    expect(emptyTree.query(5)).toBe(0);
  });

  test('Query before any update', () => {
    expect(fenwickTree.query(5)).toBe(0);
  });

  test('Single update and query works', () => {
    fenwickTree.update(4, 8);
    expect(fenwickTree.query(4)).toBe(8);
  });

  test('Multiple updates to same index', () => {
    fenwickTree.update(2, 3);
    fenwickTree.update(2, 5);
    expect(fenwickTree.query(2)).toBe(8);
  });

  test('Large value update', () => {
    fenwickTree.update(6, Number.MAX_SAFE_INTEGER);
    expect(fenwickTree.query(6)).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('Query beyond updated indices', () => {
    fenwickTree.update(3, 7);
    expect(fenwickTree.query(10)).toBe(7);
  });

  test('Update with zero value', () => {
    fenwickTree.update(5, 0);
    expect(fenwickTree.query(5)).toBe(0);
  });

  test('Update with negative and positive values', () => {
    fenwickTree.update(7, -10);
    fenwickTree.update(7, 15);
    expect(fenwickTree.query(7)).toBe(5);
  });

  test('Large index range query', () => {
    fenwickTree.update(1, 3);
    fenwickTree.update(10, 7);
    expect(fenwickTree.rangeQuery(1, 10)).toBe(10);
  });

  test('Sparse updates', () => {
    fenwickTree.update(1, 2);
    fenwickTree.update(5, 3);
    fenwickTree.update(9, 4);
    expect(fenwickTree.query(1)).toBe(2);
    expect(fenwickTree.query(5)).toBe(5);
    expect(fenwickTree.query(9)).toBe(9);
  });

  test('Fenwick Tree toString (empty tree)', () => {
    const emptyTree = new FenwickTree(5);
    expect(emptyTree.toString()).toBe('Fenwick Tree: [0, 0, 0, 0, 0]');
  });

  test('Fenwick Tree toString (single update)', () => {
    fenwickTree.update(3, 7);
    expect(fenwickTree.toString()).toBe('Fenwick Tree: [0, 0, 7, 7, 0, 0, 0, 7, 0, 0]');
  });

  test('Fenwick Tree toString (multiple updates)', () => {
    fenwickTree.update(1, 2);
    fenwickTree.update(4, 5);
    fenwickTree.update(7, 3);
    expect(fenwickTree.toString()).toBe('Fenwick Tree: [2, 2, 0, 7, 0, 0, 3, 10, 0, 0]');
  });

  test('Fenwick Tree toString (negative and positive)', () => {
    fenwickTree.update(2, 4);
    fenwickTree.update(5, -3);
    expect(fenwickTree.toString()).toBe('Fenwick Tree: [0, 4, 0, 4, -3, -3, 0, 1, 0, 0]');
  });

  test('Fenwick Tree toString (large values)', () => {
    fenwickTree.update(1, Number.MAX_SAFE_INTEGER);
    fenwickTree.update(3, -Number.MAX_SAFE_INTEGER);
    expect(fenwickTree.toString()).toBe(
      `Fenwick Tree: [${Number.MAX_SAFE_INTEGER}, ${Number.MAX_SAFE_INTEGER}, ${-Number.MAX_SAFE_INTEGER}, 0, 0, 0, 0, 0, 0, 0]`
    );
  });

  test('Positive update test', () => {
    expect(() => fenwickTree.update(5, 10)).not.toThrow();
    expect(fenwickTree.query(5)).toBe(10);
  });

  test('Edge case update at first index', () => {
    expect(() => fenwickTree.update(1, 10)).not.toThrow();
    expect(fenwickTree.query(1)).toBe(10);
  });

  test('Edge case update at last index', () => {
    expect(() => fenwickTree.update(10, 15)).not.toThrow();
    expect(fenwickTree.query(10)).toBe(15);
  });
});