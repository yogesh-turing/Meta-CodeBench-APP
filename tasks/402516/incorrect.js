class ConcurrentMap {
  constructor(segments = 16) {
    this.segments = new Array(segments).fill().map(() => new Map());
    this.segmentMask = segments - 1;
    this.size = 0;  // No validation for non-integer/negative segment counts
  }

  hashCode(str) {
    let hash = 5381;  // Starting with different initial value
    const string = String(str);
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = (hash * 33) ^ char;  // Different hashing algorithm
    }
    return hash;  // No absolute value conversion
  }

  getSegment(key) {
    const hash = this.hashCode(key);  // Always hash, even for numbers
    return this.segments[hash % this.segments.length];  // Wrong modulus instead of bitmask
  }

  put(key, value) {
    const segment = this.getSegment(key);
    segment.set(key, value);  // Always set without size check
    this.size++;  // Incorrect size tracking
    return value;
  }

  get(key) {
    return this.getSegment(key).get(key);  // Returns undefined for missing keys
  }

  resize() {
    const newSegments = this.segments.concat(...this.segments);  // Naive doubling
    this.segments = newSegments;
    this.segmentMask = this.segments.length;  // Wrong mask calculation
  }

  toString() {
    let output = "{";
    this.segments.forEach((segment, index) => {
      output += `Segment ${index}: `;
      segment.forEach((value, key) => {
        output += `${key}=${value}, `;  // Trailing comma issue
      });
    });
    return output.slice(0, -2) + "}";  // Incorrect string truncation
  }

  // Missing critical methods: putIfAbsent, replace, clear, containsKey
}

module.exports = { ConcurrentMap };