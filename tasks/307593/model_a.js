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
        throw new Error('Root must be null or an instance of TreeNode');
      }
      this.root = root;
    }
  
    /**
     * Collects nodes and their values at the current level
     * @param {TreeNode[]} currentLevelNodes - Array of nodes at current level
     * @returns {Object} Object containing level values and next level nodes
     */
    collectLevelNodes(currentLevelNodes) {
      const levelValues = [];
      const nextLevelNodes = [];
  
      while (currentLevelNodes.length > 0) {
        const node = currentLevelNodes.shift();
        levelValues.push(node.value);
  
        if (node.left) nextLevelNodes.push(node.left);
        if (node.right) nextLevelNodes.push(node.right);
      }
  
      return { levelValues, nextLevelNodes };
    }
  
    /**
     * Reverses level values based on traversal direction
     * @param {number[]} levelValues - Values at current level
     * @param {boolean} leftToRight - Current traversal direction
     * @returns {number[]} - Possibly reversed level values
     */
    reverseLevelIfNeeded(levelValues, leftToRight) {
      return leftToRight ? levelValues : levelValues.reverse();
    }
  
    /**
     * Performs zigzag level order traversal of the binary tree
     * @returns {number[][]} Array of level-wise node values
     */
    zigzagLevelOrder() {
      if (!this.root) return [];
  
      const result = [];
      let currentLevelNodes = [this.root];
      let leftToRight = true;
  
      while (currentLevelNodes.length > 0) {
        const { levelValues, nextLevelNodes } = this.collectLevelNodes(currentLevelNodes);
        result.push(this.reverseLevelIfNeeded(levelValues, leftToRight));
        
        currentLevelNodes = nextLevelNodes;
        leftToRight = !leftToRight;
      }
  
      return result;
    }
  
    /**
     * Helper function to insert nodes for testing
     * @param {number} value - Value to insert
     */
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