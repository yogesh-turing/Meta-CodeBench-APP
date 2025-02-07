class ConcurrentMap {
  constructor(segments = 16) {
    if (!Number.isInteger(segments) || segments <= 0) {
      throw new Error("Segments must be a positive integer.");
    }
    this.segments = new Array(segments).fill().map(() => new Map());
    this.segmentMask = segments - 1;
    this.size = 0;
  }

  hashCode(str) {
    let hash = 0;
    const string = String(str);
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Ensure 32-bit integer
    }
    return Math.abs(hash);
  }

  getSegment(key) {
    const hash = typeof key === "number" ? key : this.hashCode(key);
    return this.segments[hash & this.segmentMask];
  }

  put(key, value) {
    const segment = this.getSegment(key);
    if (!segment.has(key)) {
      this.size++;
    }
    segment.set(key, value);
    return value;
  }

  putIfAbsent(key, value) {
    const segment = this.getSegment(key);
    if (!segment.has(key)) {
      segment.set(key, value);
      this.size++;
      return value;
    }
    return segment.get(key);
  }

  get(key) {
    return this.getSegment(key).get(key) || null;
  }

  replace(key, oldValue, newValue) {
    const segment = this.getSegment(key);
    if (segment.get(key) === oldValue) {
      segment.set(key, newValue);
      return true;
    }
    return false;
  }

  resize() {
    const newSegmentCount = this.segments.length * 2;
    const newSegments = new Array(newSegmentCount).fill().map(() => new Map());
    const newMask = newSegmentCount - 1;

    this.segments.forEach((segment) => {
      segment.forEach((value, key) => {
        const hash = typeof key === "number" ? key : this.hashCode(key);
        newSegments[hash & newMask].set(key, value);
      });
    });

    this.segments = newSegments;
    this.segmentMask = newMask;
  }

  toString() {
    const entries = [];
    this.segments.forEach((segment) => {
      segment.forEach((value, key) => {
        entries.push(`${key}=${value}`);
      });
    });
    return `{${entries.join(", ")}}`;
  }

  clear() {
    this.segments.forEach((segment) => segment.clear());
    this.size = 0;
  }

  containsKey(key) {
    return this.getSegment(key).has(key);
  }
}

module.exports = { ConcurrentMap };