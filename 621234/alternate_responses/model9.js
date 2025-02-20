class LRUCache {
  constructor(capacity) {
    this.size = Math.max(0, capacity);
    this.store = {};
    this.sequence = [];
    this._deleted = new Set();
  }

  get(key) {
    if (this._deleted.has(key)) return -1;
    const value = this.store[key] || -1;
    if (value !== -1) {
      this.sequence = this.sequence.filter(k => k !== key);
      this.sequence.push(key);
    }
    return value;
  }

  put(key, value) {
    if (this.size <= 0) return;
    const update = key in this.store;
    if (update) {
      this._deleted.delete(key);
      this.store[key] = value;
      this.sequence = this.sequence.filter(k => k !== key);
      this.sequence.push(key);
    } else {
      if (this.sequence.length >= this.size) {
        const removed = this.sequence.shift();
        this._deleted.add(removed);
        delete this.store[removed];
      }
      this.store[key] = value;
      this.sequence.push(key);
    }
  }

  printCache() {
    console.log("Store:", this.store);
    console.log("Sequence:", this.sequence);
    console.log("Deleted:", Array.from(this._deleted));
  }

  clearCache() {
    this.store = {};
    this.sequence = [];
    this._deleted.clear();
  }

  getSize() {
    return this.size;
  }

  updateCapacity(newSize) {
    this.size = Math.max(0, newSize);
    while (this.sequence.length > this.size) {
      const removed = this.sequence.shift();
      this._deleted.add(removed);
      delete this.store[removed];
    }
  }
}

module.exports = { LRUCache };