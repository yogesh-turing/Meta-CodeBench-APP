const { LRUCache } = require('./solution.js');

describe('LRUCache', () => {
  test('should return -1 for non-existent key', () => {
    const cache = new LRUCache(2);
    expect(cache.get(99)).toBe(-1);
  });

  test('should store and retrieve values correctly', () => {
    const cache = new LRUCache(2);
    cache.put(1, 100);
    expect(cache.get(1)).toBe(100);
  });

  test('should update existing key and move it to the front', () => {
    const cache = new LRUCache(2);
    cache.put(1, 100);
    cache.put(2, 200);
    cache.put(1, 300); // Update key 1
    expect(cache.get(1)).toBe(300); // Should return updated value
  });

  test('should evict least recently used item', () => {
    const cache = new LRUCache(2);
    cache.put(1, 100);
    cache.put(2, 200);
    cache.put(3, 300); // Evicts key 1
    expect(cache.get(1)).toBe(-1); // Key 1 should be evicted
  });

  test('should maintain correct order after multiple accesses', () => {
    const cache = new LRUCache(2);
    cache.put(1, 100);
    cache.put(2, 200);
    cache.get(1); // Access key 1 (now most recently used)
    cache.put(3, 300); // Evicts key 2
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(1)).toBe(100); // Key 1 should still exist
  });

  test('should handle repeated eviction correctly', () => {
    const cache = new LRUCache(2);
    cache.put(1, 100);
    cache.put(2, 200);
    cache.put(3, 300); // Evicts key 1
    cache.put(4, 400); // Evicts key 2
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(3)).toBe(300);
    expect(cache.get(4)).toBe(400);
  });

  test('should handle edge case: capacity of 1', () => {
    const cache = new LRUCache(1);
    cache.put(1, 100);
    cache.put(2, 200); // Evicts key 1
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(2)).toBe(200);
  });

  test('should handle capacity of zero', () => {
    const cache = new LRUCache(0);
    cache.put(1, 100);
    expect(cache.get(1)).toBe(-1); // Should not store anything
  });

  test('should not crash when accessing an empty cache', () => {
    const cache = new LRUCache(3);
    expect(() => cache.get(1)).not.toThrow();
  });

  test('should handle negative or invalid capacity gracefully', () => {
    expect(() => new LRUCache(-1)).toThrow();
    expect(() => new LRUCache('invalid')).toThrow();
  });

  test('should handle complex access and eviction order', () => {
    const cache = new LRUCache(3);
    cache.put(1, 100);
    cache.put(2, 200);
    cache.put(3, 300);
    cache.get(1); // Access 1
    cache.put(4, 400); // Evicts key 2 (LRU)
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(1)).toBe(100);
    expect(cache.get(3)).toBe(300);
    expect(cache.get(4)).toBe(400);
  });

  test('should overwrite values but not duplicate keys', () => {
    const cache = new LRUCache(2);
    cache.put(1, 100);
    cache.put(1, 200);
    expect(cache.get(1)).toBe(200); // Should return updated value
  });

  test('should allow large number of operations without breaking', () => {
    const cache = new LRUCache(1000);
    for (let i = 0; i < 1000; i++) {
      cache.put(i, i * 10);
    }
    for (let i = 0; i < 1000; i++) {
      expect(cache.get(i)).toBe(i * 10);
    }
  });

  test('should not crash on extreme large capacities', () => {
    expect(() => new LRUCache(1e6)).not.toThrow();
  });
});