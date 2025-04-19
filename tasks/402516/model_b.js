class ConcurrentMap {
  constructor(initialCapacity = 16, loadFactor = 0.75) {
    this.segments = new Array(initialCapacity).fill().map(() => new Map());
    this.segmentMask = initialCapacity - 1;
    this.size = 0;
    this.loadFactor = loadFactor;
    this.threshold = Math.floor(initialCapacity * loadFactor);
  }

  hashCode(key) {
    if (key === null || key === undefined) {
      throw new Error("Key cannot be null or undefined");
    }

    if (typeof key === 'number') {
      return Math.abs(key);
    }

    const stringKey = String(key);
    let hash = 0;
    for (let i = 0; i < stringKey.length; i++) {
      const char = stringKey.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getSegment(key) {
    const hash = this.hashCode(key);
    return this.segments[hash & this.segmentMask];
  }

  put(key, value) {
    if (this.size >= this.threshold) {
      this.resize();
    }

    const segment = this.getSegment(key);
    const existed = segment.has(key);
    segment.set(key, value);
    
    if (!existed) {
      this.size++;
    }
    
    return value;
  }

  putIfAbsent(key, value) {
    const segment = this.getSegment(key);
    
    if (!segment.has(key)) {
      if (this.size >= this.threshold) {
        this.resize();
      }
      segment.set(key, value);
      this.size++;
      return value;
    }
    
    return segment.get(key);
  }

  replace(key, oldValue, newValue) {
    const segment = this.getSegment(key);
    
    if (segment.has(key) && segment.get(key) === oldValue) {
      segment.set(key, newValue);
      return true;
    }
    
    return false;
  }

  get(key) {
    return this.getSegment(key).get(key);
  }

  remove(key) {
    const segment = this.getSegment(key);
    if (segment.delete(key)) {
      this.size--;
      return true;
    }
    return false;
  }

  clear() {
    this.segments.forEach(segment => segment.clear());
    this.size = 0;
  }

  resize() {
    const newCapacity = this.segments.length * 2;
    const newSegments = new Array(newCapacity).fill().map(() => new Map());
    const newMask = newCapacity - 1;

    // Redistribute existing entries
    this.segments.forEach(segment => {
      segment.forEach((value, key) => {
        const hash = this.hashCode(key);
        newSegments[hash & newMask].set(key, value);
      });
    });

    this.segments = newSegments;
    this.segmentMask = newMask;
    this.threshold = Math.floor(newCapacity * this.loadFactor);
  }

  getSize() {
    return this.size;
  }

  isEmpty() {
    return this.size === 0;
  }

  containsKey(key) {
    return this.getSegment(key).has(key);
  }

  containsValue(value) {
    return this.segments.some(segment => {
      for (let val of segment.values()) {
        if (val === value) return true;
      }
      return false;
    });
  }

  toString() {
    const entries = [];
    this.segments.forEach(segment => {
      segment.forEach((value, key) => {
        entries.push(`${key}=${value}`);
      });
    });
    return `{${entries.join(', ')}}`;
  }

  // Iterator methods
  keys() {
    const allKeys = [];
    this.segments.forEach(segment => {
      for (let key of segment.keys()) {
        allKeys.push(key);
      }
    });
    return allKeys;
  }

  values() {
    const allValues = [];
    this.segments.forEach(segment => {
      for (let value of segment.values()) {
        allValues.push(value);
      }
    });
    return allValues;
  }

  entries() {
    const allEntries = [];
    this.segments.forEach(segment => {
      for (let entry of segment.entries()) {
        allEntries.push(entry);
      }
    });
    return allEntries;
  }
}

module.exports = { ConcurrentMap };