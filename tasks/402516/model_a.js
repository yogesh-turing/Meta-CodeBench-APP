class Segment {
  constructor() {
    this.map = new Map();
    this.lock = false;
  }

  acquireLock() {
    while (this.lock) {
      // Simulate waiting for lock
    }
    this.lock = true;
  }

  releaseLock() {
    this.lock = false;
  }
}

class ConcurrentMap {
  constructor(initialCapacity = 16, loadFactor = 0.75) {
    if (initialCapacity < 1) throw new Error("Initial capacity must be positive");
    if (loadFactor <= 0 || loadFactor >= 1) throw new Error("Load factor must be between 0 and 1");

    this.segments = new Array(initialCapacity).fill().map(() => new Segment());
    this.segmentMask = initialCapacity - 1;
    this.size = 0;
    this.loadFactor = loadFactor;
    this.resizeThreshold = Math.floor(initialCapacity * loadFactor);
  }

  hashCode(key) {
    if (key === null || key === undefined) {
      throw new Error("Key cannot be null or undefined");
    }

    let hash = 0;
    const stringKey = String(key);
    for (let i = 0; i < stringKey.length; i++) {
      hash = 31 * hash + stringKey.charCodeAt(i);
      hash = hash | 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getSegment(key) {
    const hash = typeof key === "number" ? key : this.hashCode(key);
    return this.segments[hash & this.segmentMask];
  }

  put(key, value) {
    const segment = this.getSegment(key);
    segment.acquireLock();
    try {
      if (!segment.map.has(key)) {
        this.size++;
        if (this.size > this.resizeThreshold) {
          this.resize();
        }
      }
      segment.map.set(key, value);
      return value;
    } finally {
      segment.releaseLock();
    }
  }

  putIfAbsent(key, value) {
    const segment = this.getSegment(key);
    segment.acquireLock();
    try {
      const existing = segment.map.get(key);
      if (existing === undefined) {
        segment.map.set(key, value);
        this.size++;
        if (this.size > this.resizeThreshold) {
          this.resize();
        }
        return undefined;
      }
      return existing;
    } finally {
      segment.releaseLock();
    }
  }

  replace(key, oldValue, newValue) {
    const segment = this.getSegment(key);
    segment.acquireLock();
    try {
      const current = segment.map.get(key);
      if (current === oldValue || (current !== undefined && current === oldValue)) {
        segment.map.set(key, newValue);
        return true;
      }
      return false;
    } finally {
      segment.releaseLock();
    }
  }

  get(key) {
    const segment = this.getSegment(key);
    // No lock needed for reads
    return segment.map.get(key);
  }

  remove(key) {
    const segment = this.getSegment(key);
    segment.acquireLock();
    try {
      if (segment.map.delete(key)) {
        this.size--;
        return true;
      }
      return false;
    } finally {
      segment.releaseLock();
    }
  }

  resize() {
    const newSegmentCount = this.segments.length * 2;
    const newSegments = new Array(newSegmentCount).fill().map(() => new Segment());
    const newMask = newSegmentCount - 1;

    // Lock all segments during resize
    this.segments.forEach(segment => segment.acquireLock());
    try {
      this.segments.forEach(segment => {
        segment.map.forEach((value, key) => {
          const hash = typeof key === "number" ? key : this.hashCode(key);
          newSegments[hash & newMask].map.set(key, value);
        });
      });

      this.segments = newSegments;
      this.segmentMask = newMask;
      this.resizeThreshold = Math.floor(newSegmentCount * this.loadFactor);
    } finally {
      this.segments.forEach(segment => segment.releaseLock());
    }
  }

  clear() {
    this.segments.forEach(segment => {
      segment.acquireLock();
      try {
        segment.map.clear();
      } finally {
        segment.releaseLock();
      }
    });
    this.size = 0;
  }

  toString() {
    const result = ["{"];
    let first = true;

    this.segments.forEach(segment => {
      segment.map.forEach((value, key) => {
        if (!first) result.push(", ");
        result.push(`${key}=${value}`);
        first = false;
      });
    });

    result.push("}");
    return result.join("");
  }

  getSize() {
    return this.size;
  }
}

module.exports = { ConcurrentMap };