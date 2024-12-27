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

  function dfs(node) {
      if (!node) return;

      if (node.left && !node.left.left && !node.left.right) {
          sum += node.left.value;
      }

      if (node.left) dfs(node.left);
      if (node.right) dfs(node.right);
  }

  dfs(root);

  return sum;
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(7);
root.left.left.left = new TreeNode(8);

console.log(sumOfLeftLeaves(root)); // Output: 12 (4 + 8)

module.exports = {
  TreeNode,
  sumOfLeftLeaves
};