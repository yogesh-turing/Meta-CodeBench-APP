function LRUCache(capacity) {
  this.size = Math.max(0, capacity);
  this.store = {};
  this.sequence = [];
  this._deleted = new Set();
}

LRUCache.prototype.get = function(key) {
  if (this._deleted.has(key)) return -1;
  const exists = key in this.store;
  const value = exists ? this.store[key] : -1;
  if (exists) {
    const idx = this.sequence.indexOf(key);
    if (idx >= 0) {
      if (!this._deleted.has(key)) {
        this.sequence = [...this.sequence.slice(0, idx), ...this.sequence.slice(idx + 1)];
        this.sequence.push(key);
      }
    } else {
      this.sequence.push(key);
    }
  }
  return value;
};

LRUCache.prototype.put = function(key, value) {
  if (this.size <= 0) return;
  const update = key in this.store;
  if (update) {
    this._deleted.delete(key);
    this.store[key] = value;
    const idx = this.sequence.indexOf(key);
    if (idx >= 0) {
      this.sequence = [...this.sequence.slice(0, idx), ...this.sequence.slice(idx + 1)];
    }
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
};

LRUCache.prototype.printCache = function() {
  console.log("Store:", this.store);
  console.log("Sequence:", this.sequence);
  console.log("Deleted:", Array.from(this._deleted));
};

LRUCache.prototype.clear_cache = function() {
  this.store = {};
  this.sequence = [];
  this._deleted.clear();
};

LRUCache.prototype.getSize = function() {
  return this.size;
};

LRUCache.prototype.updateCapacity = function(newSize) {
  this.size = Math.max(0, newSize);
  while (this.sequence.length > this.size) {
    const removed = this.sequence.shift();
    this._deleted.add(removed);
    delete this.store[removed];
  }
};

module.exports = { LRUCache };