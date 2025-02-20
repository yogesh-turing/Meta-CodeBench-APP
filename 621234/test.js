const { LRUCache } = require('./solution');
describe("LRUCache", () => {
  let cache;

  beforeEach(() => {
    cache = new LRUCache(3);
  });

  describe("constructor", () => {
    test("should initialize with correct size", () => {
      expect(cache.getSize()).toBe(3);
    });

    test("should handle zero size", () => {
      const zeroCache = new LRUCache(0);
      expect(zeroCache.getSize()).toBe(0);
    });

    test("should handle negative size", () => {
      const negativeCache = new LRUCache(-1);
      expect(negativeCache.getSize()).toBe(0);
    });
  });

  describe("get", () => {
    test("should return -1 for deleted keys", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);
      cache.put("d", 4); // This should cause 'a' to be deleted
      expect(cache.get("a")).toBe(-1);
    });

    test("should return value and update sequence", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);

      expect(cache.get("a")).toBe(1);
      // Use console.log to capture output
      const consoleSpy = jest.spyOn(console, "log");
      cache.printCache();

      expect(consoleSpy).toHaveBeenCalledWith("Sequence:", ["b", "c", "a"]);
      consoleSpy.mockRestore();
    });

    test("should handle non-existent keys", () => {
      expect(cache.get("nonexistent")).toBe(-1);
    });
  });

  describe("put", () => {
    test("should add new key-value pairs", () => {
      cache.put("a", 1);
      expect(cache.get("a")).toBe(1);
    });

    test("should update existing key-value pairs", () => {
      cache.put("a", 1);
      cache.put("a", 2);
      expect(cache.get("a")).toBe(2);
    });

    test("should handle zero size cache", () => {
      const zeroCache = new LRUCache(0);
      zeroCache.put("a", 1);
      expect(zeroCache.get("a")).toBe(-1);
    });

    test("should maintain deleted set when evicting", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);
      cache.put("d", 4);

      const consoleSpy = jest.spyOn(console, "log");
      cache.printCache();

      expect(consoleSpy).toHaveBeenCalledWith("Deleted:", ["a"]);
      consoleSpy.mockRestore();
    });
  });

  describe("clear_cache", () => {
    test("should clear store, sequence and deleted set", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);
      cache.put("d", 4);
      cache.clear_cache();

      const consoleSpy = jest.spyOn(console, "log");
      cache.printCache();

      expect(consoleSpy).toHaveBeenCalledWith("Store:", {});
      expect(consoleSpy).toHaveBeenCalledWith("Sequence:", []);
      expect(consoleSpy).toHaveBeenCalledWith("Deleted:", []);
      consoleSpy.mockRestore();
    });
  });

  describe("updateCapacity", () => {
    test("should update size and handle eviction", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);
      cache.updateCapacity(1);

      const consoleSpy = jest.spyOn(console, "log");
      cache.printCache();

      expect(consoleSpy).toHaveBeenCalledWith("Sequence:", ["c"]);
      expect(consoleSpy).toHaveBeenCalledWith("Deleted:", ["a", "b"]);
      consoleSpy.mockRestore();
    });

    test("should handle capacity increase", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.updateCapacity(5);
      expect(cache.getSize()).toBe(5);
    });
  });

  describe("additional cases", () => {
    test("should correctly evict least recently used key", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);
      cache.get("a"); // 'a' is now the most recently used
      cache.put("d", 4); // 'b' should be evicted, not 'a'

      expect(cache.get("b")).toBe(-1); // Expect 'b' to be evicted
      expect(cache.get("a")).toBe(1); // 'a' should still be there
    });

    test("should not allow retrieval of evicted keys after capacity update", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);
      cache.updateCapacity(2); // Should evict 'a'

      expect(cache.get("a")).toBe(-1); // 'a' should be evicted
      expect(cache.get("b")).toBe(2); // 'b' should still be there
    });

    test("should correctly update sequence when key is accessed multiple times", () => {
      cache.put("a", 1);
      cache.put("b", 2);
      cache.put("c", 3);

      cache.get("a"); // 'a' should move to the end
      cache.get("b"); // 'b' should move to the end

      cache.put("d", 4); // 'c' should be evicted

      expect(cache.get("c")).toBe(-1); // 'c' should be evicted
      expect(cache.get("a")).toBe(1); // 'a' should still be there
      expect(cache.get("b")).toBe(2); // 'b' should still be there
    });

    test("should correctly handle repeated puts and gets", () => {
      cache.put("x", 10);
      cache.put("y", 20);
      cache.put("z", 30);
      cache.get("x");
      cache.put("a", 40); // Should evict 'y', not 'x'

      expect(cache.get("y")).toBe(-1); // 'y' should be evicted
      expect(cache.get("x")).toBe(10); // 'x' should still be there
      expect(cache.get("z")).toBe(30); // 'z' should still be there
    });
  });
});