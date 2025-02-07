const AsyncLock = require('async-lock');

class ConcurrentMap {
  constructor(initialCapacity = 16, loadFactor = 0.75) {
    this.segments = new Array(initialCapacity).fill().map(() => ({
      map: new Map(),
      lock: new AsyncLock()
    }));
    this.segmentMask = initialCapacity - 1;
    this.size = 0;
    this.loadFactor = loadFactor;
    this.resizeLock = new AsyncLock();
  }

  hashCode(key) {
    if (typeof key === 'number') return Math.abs(key);
    
    let hash = 0;
    const stringKey = String(key);
    for (let i = 0; i < stringKey.length; i++) {
      hash = ((hash << 5) - hash) + stringKey.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  getSegment(key) {
    const hash = this.hashCode(key);
    return this.segments[hash & this.segmentMask];
  }

  async put(key, value) {
    const segment = this.getSegment(key);
    return segment.lock.acquire('write', async () => {
      if (!segment.map.has(key)) {
        this.size++;
        await this.checkResize();
      }
      segment.map.set(key, value);
      return value;
    });
  }

  async putIfAbsent(key, value) {
    const segment = this.getSegment(key);
    return segment.lock.acquire('write', async () => {
      if (!segment.map.has(key)) {
        this.size++;
        await this.checkResize();
        segment.map.set(key, value);
        return value;
      }
      return segment.map.get(key);
    });
  }

  async replace(key, oldValue, newValue) {
    const segment = this.getSegment(key);
    return segment.lock.acquire('write', async () => {
      if (segment.map.get(key) === oldValue) {
        segment.map.set(key, newValue);
        return true;
      }
      return false;
    });
  }

  async get(key) {
    const segment = this.getSegment(key);
    return segment.lock.acquire('read', () => {
      return segment.map.get(key);
    });
  }

  async remove(key) {
    const segment = this.getSegment(key);
    return segment.lock.acquire('write', () => {
      if (segment.map.has(key)) {
        this.size--;
        return segment.map.delete(key);
      }
      return false;
    });
  }

  async clear() {
    return this.resizeLock.acquire('write', async () => {
      await Promise.all(this.segments.map(segment =>
        segment.lock.acquire('write', () => {
          segment.map.clear();
        })
      ));
      this.size = 0;
    });
  }

  async checkResize() {
    const currentLoad = this.size / (this.segments.length * this.loadFactor);
    if (currentLoad >= 1) {
      await this.resize();
    }
  }

  async resize() {
    return this.resizeLock.acquire('write', async () => {
      const newSegmentCount = this.segments.length * 2;
      const newSegments = new Array(newSegmentCount).fill().map(() => ({
        map: new Map(),
        lock: new AsyncLock()
      }));
      const newMask = newSegmentCount - 1;

      await Promise.all(this.segments.map(segment =>
        segment.lock.acquire('read', () => {
          segment.map.forEach((value, key) => {
            const hash = this.hashCode(key);
            newSegments[hash & newMask].map.set(key, value);
          });
        })
      ));

      this.segments = newSegments;
      this.segmentMask = newMask;
    });
  }

  async toString() {
    return this.resizeLock.acquire('read', async () => {
      const result = ['{'];
      let first = true;

      await Promise.all(this.segments.map(async segment =>
        segment.lock.acquire('read', () => {
          segment.map.forEach((value, key) => {
            if (!first) result.push(', ');
            result.push(`${key}=${value}`);
            first = false;
          });
        })
      ));

      result.push('}');
      return result.join('');
    });
  }

  async size() {
    return this.size;
  }
}

module.exports = { ConcurrentMap };