class FenwickTree {
  constructor(size) {
    if (size <= 0) {
      throw new Error('Size must be positive.');
    }
    this.size = size;
    this.bit = new Array(size + 1).fill(0); // 1-based indexing
  }

  update(index, value) {
    if (index <= 0 || index > this.size) {
      throw new Error('Index out of bounds.');
    }
    while (index <= this.size) {
      this.bit[index] += value;
      index += index & -index; // Move to next index
    }
  }

  query(index) {
    if (index < 0 || index > this.size) {
      throw new Error('Index out of bounds.');
    }
    let sum = 0;
    while (index > 0) {
      sum += this.bit[index];
      index -= index & -index; // Move to parent index
    }
    return sum;
  }

  rangeQuery(left, right) {
    if (left > right) {
      throw new Error('Invalid range.');
    }
    return this.query(right) - this.query(left - 1);
  }

  toString() {
    return `Fenwick Tree: [${this.bit.slice(1).join(', ')}]`;
  }
}

module.exports = {FenwickTree};