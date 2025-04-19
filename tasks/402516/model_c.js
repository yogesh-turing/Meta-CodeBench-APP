class ConcurrentMap {
  constructor(initialCapacity = 16, loadFactor = 0.75) {
    this.segments = new Array(initialCapacity).fill().map(() => new Map());
    this.segmentMask = initialCapacity - 1;
    this.loadFactor = loadFactor;
    this.sizeCounter = new Int32Array(new SharedArrayBuffer(4)); // Thread-safe size counter
  }

  // Enhanced hash function with better distribution
  hashCode(key) {
    if (typeof key === 'number') return Math.abs(key);
    
    let hash = 0;
    const stringKey = String(key);
    for (let i = 0; i < stringKey.length; i++) {
      const char = stringKey.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Additional mixing to improve distribution
    hash ^= (hash >>> 16);
    return Math.abs(hash);
  }

  getSegment(key) {
    const hash = this.hashCode(key);
    return this.segments[hash & this.segmentMask];
  }

  // Atomic put operation
  put(key, value) {
    const segment = this.getSegment(key);
    if (!segment.has(key)) {
      Atomics.add(this.sizeCounter, 0, 1);
    }
    segment.set(key, value);
    this.checkAndResize();
    return value;
  }

  // Atomic putIfAbsent operation
  putIfAbsent(key, value) {
    const segment = this.getSegment(key);
    if (!segment.has(key)) {
      Atomics.add(this.sizeCounter, 0, 1);
      segment.set(key, value);
      this.checkAndResize();
      return value;
    }
    return segment.get(key);
  }

  // Atomic replace operation
  replace(key, oldValue, newValue) {
    const segment = this.getSegment(key);
    if (segment.has(key) && segment.get(key) === oldValue) {
      segment.set(key, newValue);
      return true;
    }
    return false;
  }

  // Thread-safe get operation
  get(key) {
    return this.getSegment(key).get(key);
  }

  // Thread-safe remove operation
  remove(key) {
    const segment = this.getSegment(key);
    if (segment.delete(key)) {
      Atomics.sub(this.sizeCounter, 0, 1);
      return true;
    }
    return false;
  }

  // Get current size atomically
  size() {
    return Atomics.load(this.sizeCounter, 0);
  }

  // Check if resize is needed and perform it atomically
  checkAndResize() {
    const currentSize = this.size();
    const capacity = this.segments.length;
    
    if (currentSize / capacity > this.loadFactor) {
      this.resize();
    }
  }

  // Thread-safe resize operation
  resize() {
    const newSegmentCount = this.segments.length * 2;
    const newSegments = new Array(newSegmentCount).fill().map(() => new Map());
    const newMask = newSegmentCount - 1;

    // Redistribute existing entries
    this.segments.forEach(segment => {
      segment.forEach((value, key) => {
        const hash = this.hashCode(key);
        newSegments[hash & newMask].set(key, value);
      });
    });

    this.segments = newSegments;
    this.segmentMask = newMask;
  }

  // Clear all segments atomically
  clear() {
    this.segments.forEach(segment => segment.clear());
    Atomics.store(this.sizeCounter, 0, 0);
  }

  // Thread-safe toString implementation
  toString() {
    const result = ['{'];
    let first = true;

    this.segments.forEach(segment => {
      segment.forEach((value, key) => {
        if (!first) result.push(', ');
        result.push(`${key}=${value}`);
        first = false;
      });
    });

    result.push('}');
    return result.join('');
  }

  // Check if key exists
  containsKey(key) {
    return this.getSegment(key).has(key);
  }

  // Get all keys
  keys() {
    const keys = [];
    this.segments.forEach(segment => {
      keys.push(...segment.keys());
    });
    return keys;
  }

  // Get all values
  values() {
    const values = [];
    this.segments.forEach(segment => {
      values.push(...segment.values());
    });
    return values;
  }
}

module.exports = { ConcurrentMap };