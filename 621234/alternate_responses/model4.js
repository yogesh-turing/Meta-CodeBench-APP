class LRUCache {
  #size;
  #store;
  #sequence;
  #deleted;

  constructor(capacity) {
    if (typeof capacity !== 'number') {
      throw new TypeError('Capacity must be a number');
    }
    this.#size = Math.max(0, capacity);
    this.#store = {};
    this.#sequence = [];
    this.#deleted = new Set();
  }

  get = (key) => {
    if (this.#deleted.has(key)) return -1;
    
    const exists = key in this.#store;
    const value = exists ? this.#store[key] : -1;
    
    if (exists && !this.#deleted.has(key)) {
      const idx = this.#sequence.indexOf(key);
      if (idx >= 0) {
        this.#sequence = [
          ...this.#sequence.slice(0, idx),
          ...this.#sequence.slice(idx + 1)
        ];
        this.#sequence.push(key);
      } else {
        this.#sequence.push(key);
      }
    }
    
    return value;
  }

  put = (key, value) => {
    if (this.#size <= 0) return;
    if (value === undefined) {
      throw new Error('Value must be provided');
    }

    const update = key in this.#store;
    
    if (update) {
      this.#deleted.delete(key);
      this.#store[key] = value;
      const idx = this.#sequence.indexOf(key);
      if (idx >= 0) {
        this.#sequence = [
          ...this.#sequence.slice(0, idx),
          ...this.#sequence.slice(idx + 1)
        ];
      }
      this.#sequence.push(key);
    } else {
      if (this.#sequence.length >= this.#size) {
        const [removed] = this.#sequence.splice(0, 1);
        this.#deleted.add(removed);
        delete this.#store[removed];
      }
      this.#store[key] = value;
      this.#sequence.push(key);
    }
  }

  printCache = () => {
    console.log("Store:", this.#store);
    console.log("Sequence:", this.#sequence);
    console.log("Deleted:", Array.from(this.#deleted));
  }

  clear_cache = () => {
    this.#store = {};
    this.#sequence = [];
    this.#deleted.clear();
  }

  getSize = () => this.#size;

  updateCapacity = (newSize) => {
    if (typeof newSize !== 'number') {
      throw new TypeError('New capacity must be a number');
    }
    
    this.#size = Math.max(0, newSize);
    
    while (this.#sequence.length > this.#size) {
      const [removed] = this.#sequence.splice(0, 1);
      this.#deleted.add(removed);
      delete this.#store[removed];
    }
  }
}

module.exports = { LRUCache };