class TreeNode {
    constructor(value = 0, left = null, right = null) {
      this.value = value;
      this.left = left;
      this.right = right;
    }
  }
  
  class BinaryTreeZigzagTraversal {
    constructor(root) {
      if (root !== null && !(root instanceof TreeNode)) {
        throw new Error("Root must be null or an instance of TreeNode");
      }
      this.root = root;
    }
  
    zigzagLevelOrder() {
      if (!this.root) return [];
      
      let result = [];
      let currentLevelNodes = [this.root];
      let leftToRight = true;
  
      while (currentLevelNodes.length > 0) {
        const levelValues = this.collectLevelNodes(currentLevelNodes);
        const finalLevelValues = this.reverseLevelIfNeeded(levelValues, leftToRight);
        
        result.push(finalLevelValues);
        leftToRight = !leftToRight;
      }
  
      return result;
    }
  
    collectLevelNodes(currentLevelNodes) {
      const levelSize = currentLevelNodes.length;
      const levelValues = [];
  
      for (let i = 0; i < levelSize; i++) {
        const node = currentLevelNodes.shift();
        levelValues.push(node.value);
  
        if (node.left) currentLevelNodes.push(node.left);
        if (node.right) currentLevelNodes.push(node.right);
      }
  
      return levelValues;
    }
  
    reverseLevelIfNeeded(levelValues, leftToRight) {
      return leftToRight ? levelValues : levelValues.reverse();
    }
  
    insertNode(value) {
      const newNode = new TreeNode(value);
      if (!this.root) {
        this.root = newNode;
        return;
      }
  
      const queue = [this.root];
      while (queue.length > 0) {
        const node = queue.shift();
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