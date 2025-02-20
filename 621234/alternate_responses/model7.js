class LRUCache {
  constructor(capacity) {
    this.size = Math.max(0, capacity);
    this.store = {};
    this.sequence = [];
    this._deleted = new Set();
  }

  get(key) {
    if (this._deleted.has(key)) return -1;
    const { store, sequence } = this;
    const value = store[key] ?? -1;
    if (value !== -1) {
      const idx = sequence.indexOf(key);
      if (idx >= 0) {
        sequence.splice(idx, 1);
        sequence.push(key);
      } else {
        sequence.push(key);
      }
    }
    return value;
  }

  put(key, value) {
    if (this.size <= 0) return;
    const { store, sequence, _deleted } = this;
    const update = key in store;
    if (update) {
      _deleted.delete(key);
      store[key] = value;
      const idx = sequence.indexOf(key);
      if (idx >= 0) {
        sequence.splice(idx, 1);
      }
      sequence.push(key);
    } else {
      if (sequence.length >= this.size) {
        const removed = sequence.shift();
        _deleted.add(removed);
        delete store[removed];
      }
      store[key] = value;
      sequence.push(key);
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