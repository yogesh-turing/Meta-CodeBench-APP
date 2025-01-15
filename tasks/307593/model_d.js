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
  
    zigzagLevelOrder() {
      if (!this.root) return [];
      
      let result = [];
      let currentLevelNodes = [this.root];
      let leftToRight = true;
  
      while (currentLevelNodes.length > 0) {
        const currentLevelValues = this.collectLevelNodes(currentLevelNodes);
        const finalLevelValues = this.reverseLevelIfNeeded(currentLevelValues, leftToRight);
        
        result.push(finalLevelValues);
        leftToRight = !leftToRight;
      }
  
      return result;
    }
  
    collectLevelNodes(currentLevelNodes) {
      if (!Array.isArray(currentLevelNodes)) {
        throw new Error('Invalid input: currentLevelNodes must be an array');
      }
  
      const levelSize = currentLevelNodes.length;
      const currentLevelValues = [];
  
      for (let i = 0; i < levelSize; i++) {
        const node = currentLevelNodes.shift();
        
        if (!(node instanceof TreeNode)) {
          throw new Error('Invalid node type in the tree');
        }
  
        currentLevelValues.push(node.value);
  
        // Add child nodes for next level processing
        if (node.left) currentLevelNodes.push(node.left);
        if (node.right) currentLevelNodes.push(node.right);
      }
  
      return currentLevelValues;
    }
  
    reverseLevelIfNeeded(levelValues, leftToRight) {
      if (!Array.isArray(levelValues)) {
        throw new Error('Invalid input: levelValues must be an array');
      }
  
      if (typeof leftToRight !== 'boolean') {
        throw new Error('Invalid input: leftToRight must be a boolean');
      }
  
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