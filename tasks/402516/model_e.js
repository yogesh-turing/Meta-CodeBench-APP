class ConcurrentMap {
    constructor(segmentCount = 16) {
      this.segments = new Array(segmentCount).fill().map(() => ({
        map: new Map(),
        lock: new Int32Array(new SharedArrayBuffer(4)) // Lock for each segment
      }));
      this.segmentMask = segmentCount - 1;
      this.sizeBuffer = new Int32Array(new SharedArrayBuffer(4)); // Atomic size counter
      this.resizeLock = new Int32Array(new SharedArrayBuffer(4)); // Lock for resizing
    }
  
    // Enhanced hash function with better distribution
    hashCode(key) {
      if (typeof key === 'number') return Math.abs(key);
      
      let hash = 0;
      const stringKey = String(key);
      for (let i = 0; i < stringKey.length; i++) {
        const charCode = stringKey.charCodeAt(i);
        hash = ((hash << 5) - hash) + charCode;
        hash = hash & hash;
      }
      return Math.abs(hash >>> 0); // Ensure positive 32-bit integer
    }
  
    getSegment(key) {
      const hash = this.hashCode(key);
      return this.segments[hash & this.segmentMask];
    }
  
    // Atomic lock acquisition
    acquireLock(lock) {
      while (Atomics.compareExchange(lock, 0, 0, 1) !== 0) {
        Atomics.wait(lock, 0, 1);
      }
    }
  
    // Lock release
    releaseLock(lock) {
      Atomics.store(lock, 0, 0);
      Atomics.notify(lock, 0, 1);
    }
  
    // Atomic put operation
    put(key, value) {
      const segment = this.getSegment(key);
      this.acquireLock(segment.lock);
      try {
        const previousSize = segment.map.size;
        segment.map.set(key, value);
        if (segment.map.size > previousSize) {
          Atomics.add(this.sizeBuffer, 0, 1);
        }
        return value;
      } finally {
        this.releaseLock(segment.lock);
      }
    }
  
    // Atomic putIfAbsent operation
    putIfAbsent(key, value) {
      const segment = this.getSegment(key);
      this.acquireLock(segment.lock);
      try {
        if (!segment.map.has(key)) {
          segment.map.set(key, value);
          Atomics.add(this.sizeBuffer, 0, 1);
          return value;
        }
        return segment.map.get(key);
      } finally {
        this.releaseLock(segment.lock);
      }
    }
  
    // Atomic replace operation
    replace(key, oldValue, newValue) {
      const segment = this.getSegment(key);
      this.acquireLock(segment.lock);
      try {
        if (segment.map.get(key) === oldValue) {
          segment.map.set(key, newValue);
          return true;
        }
        return false;
      } finally {
        this.releaseLock(segment.lock);
      }
    }
  
    // Non-blocking read operation
    get(key) {
      const segment = this.getSegment(key);
      return segment.map.get(key);
    }
  
    // Atomic remove operation
    remove(key) {
      const segment = this.getSegment(key);
      this.acquireLock(segment.lock);
      try {
        if (segment.map.delete(key)) {
          Atomics.sub(this.sizeBuffer, 0, 1);
          return true;
        }
        return false;
      } finally {
        this.releaseLock(segment.lock);
      }
    }
  
    // Thread-safe resize operation
    resize() {
      this.acquireLock(this.resizeLock);
      try {
        const newSegmentCount = this.segments.length * 2;
        const newSegments = new Array(newSegmentCount).fill().map(() => ({
          map: new Map(),
          lock: new Int32Array(new SharedArrayBuffer(4))
        }));
        const newMask = newSegmentCount - 1;
  
        // Lock all segments before redistribution
        this.segments.forEach(segment => this.acquireLock(segment.lock));
  
        try {
          this.segments.forEach(segment => {
            segment.map.forEach((value, key) => {
              const hash = this.hashCode(key);
              newSegments[hash & newMask].map.set(key, value);
            });
          });
  
          this.segments = newSegments;
          this.segmentMask = newMask;
        } finally {
          // Release all segment locks
          this.segments.forEach(segment => this.releaseLock(segment.lock));
        }
      } finally {
        this.releaseLock(this.resizeLock);
      }
    }
  
    // Get current size atomically
    get size() {
      return Atomics.load(this.sizeBuffer, 0);
    }
  
    // Thread-safe toString implementation
    toString() {
      const result = ['{'];
      let first = true;
  
      // Lock all segments for consistent snapshot
      this.segments.forEach(segment => this.acquireLock(segment.lock));
  
      try {
        this.segments.forEach(segment => {
          segment.map.forEach((value, key) => {
            if (!first) result.push(', ');
            result.push(`${key}=${value}`);
            first = false;
          });
        });
      } finally {
        // Release all locks
        this.segments.forEach(segment => this.releaseLock(segment.lock));
      }
  
      result.push('}');
      return result.join('');
    }
  
    // Clear the map atomically
    clear() {
      this.segments.forEach(segment => {
        this.acquireLock(segment.lock);
        try {
          segment.map.clear();
        } finally {
          this.releaseLock(segment.lock);
        }
      });
      Atomics.store(this.sizeBuffer, 0, 0);
    }
  }
  
  module.exports = { ConcurrentMap };