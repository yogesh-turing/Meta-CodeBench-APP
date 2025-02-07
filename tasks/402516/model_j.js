class ConcurrentMap {
    constructor(segmentCount = 16) {
      this.segments = new Array(segmentCount).fill().map(() => new Map());
      this.segmentMask = segmentCount - 1;
      this.size = 0;
      this.locks = new Array(segmentCount).fill().map(() => new Mutex());
    }
  
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
  
    async put(key, value) {
      const segment = this.getSegment(key);
      const lock = this.getLock(key);
      await lock.acquire();
      try {
        if (!segment.has(key)) {
          this.size++;
        }
        segment.set(key, value);
      } finally {
        lock.release();
      }
    }
  
    async putIfAbsent(key, value) {
      const segment = this.getSegment(key);
      const lock = this.getLock(key);
      await lock.acquire();
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
  
    async replace(key, oldValue, newValue) {
      const segment = this.getSegment(key);
      const lock = this.getLock(key);
      await lock.acquire();
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
  
    async get(key) {
      const segment = this.getSegment(key);
      return segment.get(key);
    }
  
    async resize() {
      const newSegmentCount = this.segments.length * 2;
      const newSegments = new Array(newSegmentCount).fill().map(() => new Map());
      const newLocks = new Array(newSegmentCount).fill().map(() => new Mutex());
      const newMask = newSegmentCount - 1;
  
      for (let i = 0; i < this.segments.length; i++) {
        const segment = this.segments[i];
        const lock = this.locks[i];
        await lock.acquire();
        try {
          segment.forEach((value, key) => {
            const hash = typeof key === "number" ? key : this.hashCode(key);
            newSegments[hash & newMask].set(key, value);
          });
        } finally {
          lock.release();
        }
      }
  
      this.segments = newSegments;
      this.locks = newLocks;
      this.segmentMask = newMask;
    }
  
    async toString() {
      const result = ["{"];
      let first = true;
  
      for (let i = 0; i < this.segments.length; i++) {
        const segment = this.segments[i];
        const lock = this.locks[i];
        await lock.acquire();
        try {
          segment.forEach((value, key) => {
            if (!first) result.push(", ");
            result.push(`${key}=${value}`);
            first = false;
          });
        } finally {
          lock.release();
        }
      }
  
      result.push("}");
      return result.join("");
    }
  }
  
  class Mutex {
    constructor() {
      this._locked = false;
      this._queue = [];
    }
  
    async acquire() {
      if (this._locked) {
        await new Promise(resolve => this._queue.push(resolve));
      }
      this._locked = true;
    }
  
    release() {
      if (!this._locked) {
        throw new Error("Mutex is not locked");
      }
      this._locked = false;
      if (this._queue.length > 0) {
        this._queue.shift()();
      }
    }
  }
  
  module.exports = { ConcurrentMap };
  
  // Example usage
//   const map = new ConcurrentMap();
//   map.put("key1", "value1");
//   map.put("key2", "value2");
//   console.log(await map.get("key1")); // Output: value1
//   console.log(await map.toString()); // Output: {key1=value1, key2=value2}