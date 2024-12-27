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
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();

    if (node.left) {
      if (!node.left.left && !node.left.right) {
        sum += node.left.value;
      } else {
        stack.push(node.left);
      }
    }

    if (node.right) {
      stack.push(node.right);
    }
  }

  return sum;
}

module.exports = {
  TreeNode,
  sumOfLeftLeaves
};