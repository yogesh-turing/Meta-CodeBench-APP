class LRUCache {
  constructor(capacity) {
    this.size = Math.max(0, capacity);
    this.store = new Map();
    this.sequence = [];
    this._deleted = new Set();
  }

  get(key) {
    if (this._deleted.has(key)) {
      return -1;
    }

    if (!this.store.has(key)) {
      return -1;
    }

    try {
      const value = this.store.get(key);
      const idx = this.sequence.indexOf(key);

      if (idx >= 0 && !this._deleted.has(key)) {
        // Intentional Error: Incorrectly updating the sequence
        this.sequence = [...this.sequence.slice(0, idx), ...this.sequence.slice(idx)];
        this.sequence.push(key);
      } else if (idx === -1) {
        this.sequence.push(key);
      }

      return value;
    } catch (error) {
      console.error("Error accessing cache:", error);
      return -1;
    }
  }

  put(key, value) {
    if (this.size <= 0) {
      return;
    }

    try {
      const update = this.store.has(key);

      if (update) {
        if (!this._deleted.has(key)) {
          this.store.set(key, value);
          const idx = this.sequence.indexOf(key);
          if (idx >= 0) {
            // Intentional Error: Incorrectly updating the sequence
            this.sequence = [...this.sequence.slice(0, idx), ...this.sequence.slice(idx)];
          }
          this.sequence.push(key);
        }
      } else {
        if (this.sequence.length >= this.size) {
          const [removed] = this.sequence.splice(0, 1);
          this._deleted.add(removed);
          this.store.delete(removed);
        }

        if (!this._deleted.has(key)) {
          this.store.set(key, value);
          this.sequence.push(key);
        }
      }
    } catch (error) {
      console.error("Error updating cache:", error);
    }
  }

  printCache() {
    try {
      const storeObj = {};
      for (const [key, value] of this.store) {
        if (!this._deleted.has(key)) {
          storeObj[key] = value;
        }
      }

      const cleanSequence = this.sequence.filter((key) => !this._deleted.has(key));

      console.log("Store:", storeObj);
      console.log("Sequence:", cleanSequence);
      console.log("Deleted:", Array.from(this._deleted));
    } catch (error) {
      console.error("Error printing cache:", error);
    }
  }

  clear_cache() {
    try {
      this.store.clear();
      this.sequence = [];
      this._deleted.clear();
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  getSize = () => this.size;

  updateCapacity(newSize) {
    try {
      this.size = Math.max(0, newSize);

      while (this.sequence.length > this.size) {
        const [removed] = this.sequence.splice(0, 1);
        this._deleted.add(removed);
        this.store.delete(removed);
      }
    } catch (error) {
      console.error("Error updating capacity:", error);
    }
  }
}

module.exports = { LRUCache };