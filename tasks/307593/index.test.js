const { BinaryTreeZigzagTraversal, TreeNode } = require(process.env.TARGET_FILE);

describe("BinaryTreeZigzagTraversal", () => {
  let tree;

  beforeEach(() => {
    tree = new BinaryTreeZigzagTraversal(null);
  });

  describe("Constructor and Basic Structure", () => {
    test("should initialize with null root", () => {
      expect(tree.root).toBeNull();
    });

    test("should throw error for invalid root", () => {
      expect(() => new BinaryTreeZigzagTraversal()).toThrow();
    });

    test("should create TreeNode with default values", () => {
      const node = new TreeNode();
      expect(node.value).toBe(0);
      expect(node.left).toBeNull();
      expect(node.right).toBeNull();
    });

    test("should create TreeNode with specified values", () => {
      const node = new TreeNode(5);
      expect(node.value).toBe(5);
      expect(node.left).toBeNull();
      expect(node.right).toBeNull();
    });
  });

  describe("insertNode", () => {
    test("should insert first node as root", () => {
      tree.insertNode(1);
      expect(tree.root.value).toBe(1);
    });

    test("should insert nodes in level-order", () => {
      [1, 2, 3, 4, 5].forEach((val) => tree.insertNode(val));
      expect(tree.root.value).toBe(1);
      expect(tree.root.left.value).toBe(2);
      expect(tree.root.right.value).toBe(3);
      expect(tree.root.left.left.value).toBe(4);
      expect(tree.root.left.right.value).toBe(5);
    });

    test("should handle insertion of negative values", () => {
      [-1, -2, -3].forEach((val) => tree.insertNode(val));
      expect(tree.root.value).toBe(-1);
      expect(tree.root.left.value).toBe(-2);
      expect(tree.root.right.value).toBe(-3);
    });

    test("should handle insertion of zero", () => {
      tree.insertNode(0);
      expect(tree.root.value).toBe(0);
    });

    test("should throw error for invalid input during insertion", () => {
      expect(() => tree.insertNode(null)).toThrow();
      expect(() => tree.insertNode(undefined)).toThrow();
    });
  });

  describe("zigzagLevelOrder", () => {
    test("should return empty array for null root", () => {
      expect(tree.zigzagLevelOrder()).toEqual([]);
    });

    test("should handle single node tree", () => {
      tree.insertNode(1);
      expect(tree.zigzagLevelOrder()).toEqual([[1]]);
    });

    test("should handle two-level tree", () => {
      [1, 2, 3].forEach((val) => tree.insertNode(val));
      expect(tree.zigzagLevelOrder()).toEqual([[1], [3, 2]]);
    });

    test("should handle three-level complete tree", () => {
      [1, 2, 3, 4, 5, 6, 7].forEach((val) => tree.insertNode(val));
      expect(tree.zigzagLevelOrder()).toEqual([[1], [3, 2], [4, 5, 6, 7]]);
    });
  });

  describe("collectLevelNodes", () => {
    test("should collect nodes at current level", () => {
      [1, 2, 3].forEach((val) => tree.insertNode(val));
      const levelNodes = [tree.root.left, tree.root.right];
      expect(tree.collectLevelNodes(levelNodes)).toEqual([2, 3]);
    });

    test("should handle empty level", () => {
      expect(tree.collectLevelNodes([])).toEqual([]);
    });

    test("should handle level with single node", () => {
      tree.insertNode(1);
      expect(tree.collectLevelNodes([tree.root])).toEqual([1]);
    });

    test("should throw an error for invalid level", () => {
      expect(() => tree.collectLevelNodes(undefined)).toThrow();
      expect(() => tree.collectLevelNodes(null)).toThrow();
    });
  });

  describe("reverseLevelIfNeeded", () => {
    test("should not reverse when leftToRight is true", () => {
      const values = [1, 2, 3];
      expect(tree.reverseLevelIfNeeded(values, true)).toEqual([1, 2, 3]);
    });

    test("should reverse when leftToRight is false", () => {
      const values = [1, 2, 3];
      expect(tree.reverseLevelIfNeeded(values, false)).toEqual([3, 2, 1]);
    });

    test("should handle empty array", () => {
      expect(tree.reverseLevelIfNeeded([], true)).toEqual([]);
      expect(tree.reverseLevelIfNeeded([], false)).toEqual([]);
    });

    test("should handle single element array", () => {
      expect(tree.reverseLevelIfNeeded([1], true)).toEqual([1]);
      expect(tree.reverseLevelIfNeeded([1], false)).toEqual([1]);
    });

    test("should throw error for invalid input", () => {
      expect(() => tree.reverseLevelIfNeeded(undefined, true)).toThrow();
      expect(() => tree.reverseLevelIfNeeded(null, false)).toThrow();
    });
  });

  describe("Edge Cases and Special Scenarios", () => {
    test("should handle tree with duplicate values", () => {
      [1, 1, 1, 1].forEach((val) => tree.insertNode(val));
      expect(tree.zigzagLevelOrder()).toEqual([[1], [1, 1], [1]]);
    });

    test("should handle alternating positive and negative values", () => {
      [1, -2, 3, -4, 5].forEach((val) => tree.insertNode(val));
      expect(tree.zigzagLevelOrder()).toEqual([[1], [3, -2], [-4, 5]]);
    });

    test("should handle large number of nodes", () => {
      const values = Array.from({ length: 100 }, (_, i) => i + 1);
      values.forEach((val) => tree.insertNode(val));
      const result = tree.zigzagLevelOrder();
      expect(result.length).toBeGreaterThan(0);
      expect(Array.isArray(result[0])).toBeTruthy();
    });
  });

  describe("Performance Tests", () => {
    test("should handle deep trees efficiently", () => {
      const start = Date.now();
      const values = Array.from({ length: 1000 }, (_, i) => i);
      values.forEach((val) => tree.insertNode(val));
      tree.zigzagLevelOrder();
      const end = Date.now();
      expect(end - start).toBeLessThan(1000);
    });
  });
});