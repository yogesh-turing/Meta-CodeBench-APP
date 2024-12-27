const { sumOfLeftLeaves, TreeNode } = require(process.env.TARGET_FILE);


describe("sumOfLeftLeaves", () => {
  it("should create a TreeNode with default values", () => {
    const node = new TreeNode();
    expect(node.value).toBe(0);
    expect(node.left).toBe(null);
    expect(node.right).toBe(null);
  });

  it("should return 0 for an empty tree", () => {
    const root = null;
    expect(sumOfLeftLeaves(root)).toBe(0);
  });

  it("should return 0 when the tree has only one node", () => {
    const root = new TreeNode(1);
    expect(sumOfLeftLeaves(root)).toBe(0);
  });

  it("should return sum of left leaves only", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.left.left = new TreeNode(3);
    expect(sumOfLeftLeaves(root)).toBe(3);
  });

  it("should correctly sum left leaves and ignore right leaves", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.right.left = new TreeNode(5);
    root.right.right = new TreeNode(6);
    expect(sumOfLeftLeaves(root)).toBe(9);
  });

  it("should return 0 when there are no left leaves", () => {
    const root = new TreeNode(1);
    root.right = new TreeNode(2);
    root.right.right = new TreeNode(3);
    expect(sumOfLeftLeaves(root)).toBe(0);
  });

  it("should return the sum of all left leaves", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.left.left = new TreeNode(3);
    root.left.left.left = new TreeNode(4);
    expect(sumOfLeftLeaves(root)).toBe(4);
  });

  it("should handle large trees efficiently", () => {
    const root = new TreeNode(1);
    let node = root;
    for (let i = 2; i <= 1000000; i++) {
      node.left = new TreeNode(i);
      node = node.left;
    }
    expect(sumOfLeftLeaves(root)).toBe(1000000);
  });

  it("should return the sum of all nodes if all are left leaves", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.left.left = new TreeNode(3);
    root.left.left.left = new TreeNode(4);
    expect(sumOfLeftLeaves(root)).toBe(4);
  });

  it("should handle a mixed tree and return correct sum of left leaves", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.left = new TreeNode(6);
    root.right.right = new TreeNode(7);
    expect(sumOfLeftLeaves(root)).toBe(10);
  });

  it("should return 0 when all nodes are right children", () => {
    const root = new TreeNode(1);
    let node = root;
    for (let i = 2; i <= 1000000; i++) {
      node.right = new TreeNode(i);
      node = node.right;
    }
    expect(sumOfLeftLeaves(root)).toBe(0);
  });
});