class ConcurrentMap {
  constructor(segmentCount = 16) {
    this.segments = new Array(segmentCount).fill().map(() => new Map());
    this.segmentMask = segmentCount - 1;
    this.size = 0;
    this.locks = new Array(segmentCount).fill().map(() => new Lock());
  }

  // Simple hash function
  hashCode(key) {
    let hash = 0;
    const stringKey = String(key);
    for (let i = 0; i < stringKey.length; i++) {
      const charCode = stringKey.charCodeAt(i);
      hash = (hash << 5) - hash + charCode;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getSegment(key) {
    const hash = typeof key === "number" ? key : this.hashCode(key);
    return this.segments[hash & this.segmentMask];
  }

  getLock(key) {
    const hash = typeof key === "number" ? key : this.hashCode(key);
    return this.locks[hash & this.segmentMask];
  }

  put(key, value) {
    const segment = this.getSegment(key);
    const lock = this.getLock(key);
    lock.acquire();
    try {
      if (!segment.has(key)) {
        this.size++;
      }
      segment.set(key, value);
      return value;
    } finally {
      lock.release();
    }
  }

  putIfAbsent(key, value) {
    const segment = this.getSegment(key);
    const lock = this.getLock(key);
    lock.acquire();
    try {
      if (!segment.has(key)) {
        segment.set(key, value);
        this.size++;
        return true;
      }
      return false;
    } finally {
      lock.release();
    }
  }

  replace(key, oldValue, newValue) {
    const segment = this.getSegment(key);
    const lock = this.getLock(key);
    lock.acquire();
    try {
      if (segment.has(key) && segment.get(key) === oldValue) {
        segment.set(key, newValue);
        return true;
      }
      return false;
    } finally {
      lock.release();
    }
  }

  get(key) {
    const segment = this.getSegment(key);
    return segment.get(key);
  }

  resize() {
    const newSegmentCount = this.segments.length * 2;
    const newSegments = new Array(newSegmentCount).fill().map(() => new Map());
    const newLocks = new Array(newSegmentCount).fill().map(() => new Lock());
    const newMask = newSegmentCount - 1;

    this.segments.forEach((segment, index) => {
      const lock = this.locks[index];
      lock.acquire();
      try {
        segment.forEach((value, key) => {
          const hash = typeof key === "number" ? key : this.hashCode(key);
          newSegments[hash & newMask].set(key, value);
        });
      } finally {
        lock.release();
      }
    });

    this.segments = newSegments;
    this.locks = newLocks;
    this.segmentMask = newMask;
  }

  toString() {
    const result = ["{"];
    let first = true;

    this.segments.forEach(segment => {
      segment.forEach((value, key) => {
        if (!first) result.push(", ");
        result.push(`${key}=${value}`);
        first = false;
      });
    });

    result.push("}");
    return result.join("");
  }
}

class Lock {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  acquire() {
    if (this.locked) {
      return new Promise(resolve => {
        this.queue.push(resolve);
      });
    }
    this.locked = true;
  }

  release() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }
}

module.exports = { ConcurrentMap };

// Example usage
const map = new ConcurrentMap();
map.put("key1", "value1");
map.put("key2", "value2");
console.log(map.get("key1")); // Output: value1
console.log(map.toString()); // Output: {key1=value1, key2=value2}