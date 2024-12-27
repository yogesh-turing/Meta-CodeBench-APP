class TreeNode {
  constructor(value = 0, left = null, right = null) {
      this.value = value;
      this.left = left;
      this.right = right;
  }
}

function sumOfLeftLeaves(root) {
  if (!root) return 0;

  let sum = 0;

  function dfs(node, isLeft) {
      if (!node) return;

      if (!node.left && !node.right && isLeft) {
          sum += node.value;
      }

      dfs(node.left, true);
      dfs(node.right, false);
  }

  dfs(root, false);

  return sum;
}

module.exports = {
  TreeNode,
  sumOfLeftLeaves
};