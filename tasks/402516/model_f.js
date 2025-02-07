class ConcurrentMap {
    constructor(segmentCount = 16) {
      this.segments = new Array(segmentCount).fill().map(() => new Map());
      this.segmentMask = segmentCount - 1;
      this.size = 0;
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
  
    put(key, value) {
      const segment = this.getSegment(key);
      if (!segment.has(key)) {
        this.size++;
      }
      segment.set(key, value);
      return value;
    }
  
    get(key) {
      return this.getSegment(key).get(key);
    }
  
    putIfAbsent(key, value) {
      const segment = this.getSegment(key);
      if (!segment.has(key)) {
        segment.set(key, value);
        this.size++;
        return true;
      }
      return false;
    }
  
    replace(key, oldValue, newValue) {
      const segment = this.getSegment(key);
      if (segment.has(key) && segment.get(key) === oldValue) {
        segment.set(key, newValue);
        return true;
      }
      return false;
    }
  
    resize() {
      const newSegmentCount = this.segments.length * 2;
      const newSegments = new Array(newSegmentCount).fill().map(() => new Map());
      const newMask = newSegmentCount - 1;
  
      this.segments.forEach(segment => {
        segment.forEach((value, key) => {
          const hash = typeof key === "number" ? key : this.hashCode(key);
          newSegments[hash & newMask].set(key, value);
        });
      });
  
      this.segments = newSegments;
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
  
  module.exports = { ConcurrentMap };
  
  // Example usage
  const map = new ConcurrentMap();
  map.put("key1", "value1");
  map.put("key2", "value2");
  console.log(map.get("key1")); // Output: value1
  console.log(map.toString()); // Output: {key1=value1, key2=value2}
  
  console.log(map.putIfAbsent("key3", "value3")); // Output: true
  console.log(map.putIfAbsent("key1", "newValue1")); // Output: false
  
  console.log(map.replace("key2", "value2", "newValue2")); // Output: true
  console.log(map.replace("key2", "wrongValue", "newValue2")); // Output: false
  
  console.log(map.toString()); // Output: {key1=value1, key2=newValue2, key3=value3}