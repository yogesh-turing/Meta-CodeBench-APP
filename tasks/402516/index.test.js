const { ConcurrentMap } = require('./correct');

describe("ConcurrentMap", () => {
  test("should initialize with empty segments", () => {
    const map = new ConcurrentMap();
    expect(map.size).toBe(0);
    expect(map.toString()).toBe("{}");
  });

  test("should correctly hash keys to segments", () => {
    const map = new ConcurrentMap(4);
    map.put("key1", "value1");
    map.put("key2", "value2");
    expect(map.get("key1")).toBe("value1");
    expect(map.get("key2")).toBe("value2");
  });

  test("should add and retrieve values", () => {
    const map = new ConcurrentMap();
    map.put(1, "Value1");
    map.put(2, "Value2");
    expect(map.get(1)).toBe("Value1");
    expect(map.get(2)).toBe("Value2");
  });

  test("should handle putIfAbsent correctly", () => {
    const map = new ConcurrentMap();
    map.putIfAbsent(1, "Value1");
    expect(map.get(1)).toBe("Value1");
    map.putIfAbsent(1, "NewValue1");
    expect(map.get(1)).toBe("Value1");
  });

  test("should handle replace operation correctly", () => {
    const map = new ConcurrentMap();
    map.put(1, "Value1");
    const replaced = map.replace(1, "Value1", "Value2");
    expect(replaced).toBe(true);
    expect(map.get(1)).toBe("Value2");

    const failedReplace = map.replace(1, "Value1", "Value3");
    expect(failedReplace).toBe(false);
    expect(map.get(1)).toBe("Value2");
  });

  test("should resize correctly", () => {
    const map = new ConcurrentMap(2);
    for (let i = 1; i <= 10; i++) {
      map.put(i, `Value${i}`);
    }
    expect(map.size).toBe(10);
    expect(map.get(10)).toBe("Value10");
  });

  test("should produce correct string representation", () => {
    const map = new ConcurrentMap();
    map.put(1, "Value1");
    map.put(2, "Value2");
    expect(map.toString()).toBe("{1=Value1, 2=Value2}");
  });

  test("should handle concurrent put and get operations", async () => {
    const map = new ConcurrentMap();
    const keys = Array.from({ length: 50 }, (_, i) => i);

    const putTasks = keys.map((key) => {
      return new Promise((resolve) => {
        map.put(key, `Value${key}`);
        resolve();
      });
    });

    const getTasks = keys.map((key) => {
      return new Promise((resolve) => {
        const value = map.get(key);
        resolve(value);
      });
    });

    await Promise.all([...putTasks, ...getTasks]);

    keys.forEach((key) => {
      expect(map.get(key)).toBe(`Value${key}`);
    });
  });

  // New Test Cases to Align with Prompt
  test("should maintain correct behavior during resize under high load", () => {
    const map = new ConcurrentMap(2);
    const threads = 10;
    const valuesPerThread = 100;

    const tasks = Array.from({ length: threads }, (_, threadId) => {
      return new Promise((resolve) => {
        for (let i = 1; i <= valuesPerThread; i++) {
          map.put(`${threadId}_${i}`, `Value${threadId}_${i}`);
        }
        resolve();
      });
    });

    return Promise.all(tasks).then(() => {
      expect(map.size).toBe(threads * valuesPerThread);
      expect(map.get("1_50")).toBe("Value1_50");
      expect(map.get("5_100")).toBe("Value5_100");
    });
  });

  test("should ensure consistent state with concurrent putIfAbsent operations", async () => {
    const map = new ConcurrentMap();
    const key = "sharedKey";

    const tasks = Array.from({ length: 20 }, (_, i) => {
      return new Promise((resolve) => {
        map.putIfAbsent(key, `Value${i}`);
        resolve();
      });
    });

    await Promise.all(tasks);

    const finalValue = map.get(key);
    expect(finalValue).toMatch(/^Value\d+$/); // Should match one of the values
  });

  test("should properly hash keys with minimal collisions", () => {
    const map = new ConcurrentMap(16);

    for (let i = 1; i <= 100; i++) {
      map.put(i, `Value${i}`);
    }

    const segmentCounts = map.segments.map((segment) => segment.size);
    const maxSegmentCount = Math.max(...segmentCounts);
    const minSegmentCount = Math.min(...segmentCounts);

    // Check for even distribution
    expect(maxSegmentCount - minSegmentCount).toBeLessThan(10); // Tolerable imbalance
  });
  test("should handle invalid segment size during initialization", () => {
    expect(() => new ConcurrentMap(-1)).toThrow();
    expect(() => new ConcurrentMap(0)).toThrow();
    expect(() => new ConcurrentMap(1.5)).toThrow();
  });

  test("should return null for non-existent keys", () => {
    const map = new ConcurrentMap();
    expect(map.get("nonexistent")).toBeNull();
  });

  test("should correctly clear all entries", () => {
    const map = new ConcurrentMap();
    map.put(1, "Value1");
    map.put(2, "Value2");
    expect(map.size).toBe(2);
    map.clear();
    expect(map.size).toBe(0);
    expect(map.toString()).toBe("{}");
  });

  test("should correctly check key existence", () => {
    const map = new ConcurrentMap();
    map.put(1, "Value1");
    expect(map.containsKey(1)).toBe(true);
    expect(map.containsKey(2)).toBe(false);
  });

  test("should not modify map on putIfAbsent with existing key", () => {
    const map = new ConcurrentMap();
    map.put(1, "Value1");
    const result = map.putIfAbsent(1, "Value2");
    expect(result).toBe("Value1");
    expect(map.get(1)).toBe("Value1");
  });

  test("should correctly resize and maintain entries", () => {
    const map = new ConcurrentMap(2);
    for (let i = 0; i < 20; i++) {
      map.put(i, `Value${i}`);
    }
    map.resize();
    expect(map.size).toBe(20);
    for (let i = 0; i < 20; i++) {
      expect(map.get(i)).toBe(`Value${i}`);
    }
  });
});