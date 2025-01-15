class TreeNode {
  constructor(value = 0, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class BinaryTreeZigzagTraversal {

  constructor(root) {
    this.root = root;
  }

  // The main function to get the zigzag level order traversal
  zigzagLevelOrder() {
    if (!this.root) return [];

    let result = [];
    let currentLevelNodes = [this.root]; // Queue for BFS traversal
    let leftToRight = true;  // Flag to alternate direction

    while (currentLevelNodes.length > 0) {
      let levelValues = this.collectLevelNodes(currentLevelNodes);
      levelValues = this.reverseLevelIfNeeded(levelValues, leftToRight);

      result.push(levelValues);
      leftToRight = !leftToRight;  // Toggle the direction for next level
    }

    return result;
  }

  // Helper method to collect nodes at each level
  collectLevelNodes(currentLevelNodes) {
    let levelValues = [];
    let nextLevelNodes = [];

    while (currentLevelNodes.length > 0) {
      let node = currentLevelNodes.shift(); // Dequeue node
      levelValues.push(node.value);

      if (node.left) nextLevelNodes.push(node.left);
      if (node.right) nextLevelNodes.push(node.right);
    }

    currentLevelNodes.push(...nextLevelNodes); // Update the queue for next level
    return levelValues;
  }

  // Helper method to reverse the level values if needed
  reverseLevelIfNeeded(levelValues, leftToRight) {
    if (!leftToRight) {
      levelValues.reverse();
    }
    return levelValues;
  }

  // Helper function to insert nodes for testing 
  insertNode(value) {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let queue = [this.root];
    while (queue.length > 0) {
      let node = queue.shift();
      if (!node.left) {
        node.left = newNode;
        return;
      } else {
        queue.push(node.left);
      }
      if (!node.right) {
        node.right = newNode;
        return;
      } else {
        queue.push(node.right);
      }
    }
  }
}

module.exports = { BinaryTreeZigzagTraversal, TreeNode };