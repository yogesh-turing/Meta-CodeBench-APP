class FenwickTree {
    /**
     * A Binary Indexed Tree (Fenwick Tree) implementation for efficient range sum queries.
     */
    constructor(size) {
        if (size <= 0) {
            throw new Error('Size must be positive.');
        }
        this.size = size;
        this.bit = new Array(size + 1).fill(0);
    }

    /**
     * Add value to element at given index.
     * @param {number} index The index to update (1-based index).
     * @param {number} value The value to add.
     * @throws {Error} if index is out of bounds.
     */
    update(index, value) {
        if (index <= 0 || index > this.size) {
            throw new Error('Index out of bounds.');
        }
        for (let i = index; i <= this.size; i += i & (-i)) {
            this.bit[i] += value;
        }
    }

    /**
     * Calculate prefix sum up to given index.
     * @param {number} index The index to query (1-based index).
     * @return {number} The sum from index 1 to the given index.
     * @throws {Error} if index is out of bounds.
     */
    query(index) {
        if (index <= 0 || index > this.size) {
            throw new Error('Index out of bounds.');
        }
        let sum = 0;
        for (let i = index; i > 0; i -= i & (-i)) {
            sum += this.bit[i];
        }
        return sum;
    }

    /**
     * Calculate sum of elements in range [left, right].
     * @param {number} left The starting index (1-based index).
     * @param {number} right The ending index (1-based index).
     * @return {number} The sum of elements from left to right.
     * @throws {Error} if left > right or indices are out of bounds.
     */
    rangeQuery(left, right) {
        if (left > right) {
            throw new Error('Left index cannot be greater than right index.');
        }
        if (left <= 0 || right > this.size) {
            throw new Error('Indices out of bounds.');
        }
        return this.query(right) - this.query(left - 1);
    }

    /**
     * Return string representation of the Fenwick Tree.
     * @return {string} The BIT array as a readable string.
     */
    toString() {
        return this.bit.slice(1).join(', ');
    }
}

module.exports = { FenwickTree };