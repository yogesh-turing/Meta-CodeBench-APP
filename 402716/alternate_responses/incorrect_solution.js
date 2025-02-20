// FenwickTree.js

class FenwickTree {
  /**
   * A Binary Indexed Tree (Fenwick Tree) implementation for efficient range sum queries.
   * @param {number} size - The size of the tree.
   * @throws {Error} If size is non-positive.
   */
  constructor(size) {
      if (size <= 0) {
          throw new Error("Size must be a positive integer.");
      }
      this.size = size;
      this.bit = new Array(size + 1).fill(0);
  }

  /**
   * Add value to element at given index.
   * @param {number} index - The index to update (1-based index).
   * @param {number} value - The value to add.
   * @throws {Error} If index is out of bounds.
   */
  update(index, value) {
      if (index < 1 || index > this.size) {
          throw new Error("Index is out of bounds.");
      }
      while (index <= this.size) {
          this.bit[index] += value;
          index += index & -index;
      }
  }

  /**
   * Calculate prefix sum up to given index.
   * @param {number} index - The index to query (1-based index).
   * @returns {number} The sum from index 1 to the given index.
   * @throws {Error} If index is out of bounds.
   */
  query(index) {
      if (index < 1 || index > this.size) {
          throw new Error("Index is out of bounds.");
      }
      let sum = 0;
      while (index > 0) {
          sum += this.bit[index];
          index -= index & -index;
      }
      return sum;
  }

  /**
   * Calculate sum of elements in range [left, right].
   * @param {number} left - The starting index (1-based index).
   * @param {number} right - The ending index (1-based index).
   * @returns {number} The sum of elements from left to right.
   * @throws {Error} If left > right or indices are out of bounds.
   */
  rangeQuery(left, right) {
      if (left > right) {
          throw new Error("Left index cannot be greater than right index.");
      }
      if (left < 1 || right > this.size) {
          throw new Error("Indices are out of bounds.");
      }
      return this.query(right) - this.query(left - 1);
  }

  /**
   * Return string representation of the Fenwick Tree.
   * @returns {string} The BIT array as a readable string.
   */
  toString() {
      return `[${this.bit.slice(1).join(', ')}]`;
  }
}

// Export the FenwickTree class
module.exports = {FenwickTree};