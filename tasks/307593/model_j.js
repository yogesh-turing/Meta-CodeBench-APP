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
        let levelSize = currentLevelNodes.length;
        let currentLevelValues = [];
  
        // Collect nodes at the current level and enqueue their children
        currentLevelValues = this.collectLevelNodes(currentLevelNodes, levelSize);
  
        // Reverse the current level's values if traversing right-to-left
        currentLevelValues = this.reverseLevelIfNeeded(currentLevelValues, leftToRight);
  
        result.push(currentLevelValues);
        leftToRight = !leftToRight;  // Toggle the direction for next level
      }
  
      return result;
    }
  
    // Helper function to collect nodes at the current level and enqueue their children
    collectLevelNodes(currentLevelNodes, levelSize) {
      let currentLevelValues = [];
      for (let i = 0; i < levelSize; i++) {
        let node = currentLevelNodes.shift(); // Dequeue node
        currentLevelValues.push(node.value);
  
        if (node.left) currentLevelNodes.push(node.left);
        if (node.right) currentLevelNodes.push(node.right);
      }
      return currentLevelValues;
    }
  
    // Helper function to reverse the current level's values if traversing right-to-left
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