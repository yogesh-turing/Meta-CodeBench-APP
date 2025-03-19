// const { CollectionHelper } = require(process.env.TARGET_FILE);
const { CollectionHelper } = require('./incorrect');

describe('CollectionHelper', () => {
  describe('addToSet', () => {
    it('should add a new element and return true; and not add duplicates', () => {
      const set = new Set([1, 2]);
      const addedNew = CollectionHelper.addToSet(set, 3);
      expect(addedNew).toBe(true);
      expect(set.has(3)).toBe(true);
      expect(set.size).toBe(3);
      const addedDuplicate = CollectionHelper.addToSet(set, 1);
      expect(addedDuplicate).toBe(false);
      expect(set.size).toBe(3);
    });

    it('should throw a TypeError when the collection is not a Set', () => {
      expect(() => CollectionHelper.addToSet([], 1)).toThrow(TypeError);
    });
  });

  describe('removeFromSet', () => {
    it('should remove an element and return true; and return false if element is absent', () => {
      const set = new Set([1, 2, 3]);
      // Removing an existing element
      const removedExisting = CollectionHelper.removeFromSet(set, 2);
      expect(removedExisting).toBe(true);
      expect(set.has(2)).toBe(false);
      expect(set.size).toBe(2);
      // Removing a non-existing element returns false
      const removedNonExisting = CollectionHelper.removeFromSet(set, 5);
      expect(removedNonExisting).toBe(false);
      expect(set.size).toBe(2);
    });

    it('should throw a TypeError when the collection is not a Set', () => {
      expect(() => CollectionHelper.removeFromSet([], 1)).toThrow(TypeError);
    });
  });

  describe('union', () => {
    it('should return the union of two sets', () => {
      const setA = new Set([1, 2]);
      const setB = new Set([2, 3]);
      const unionSet = CollectionHelper.union(setA, setB);
      expect(unionSet).toBeInstanceOf(Set);
      expect(unionSet.has(1)).toBe(true);
      expect(unionSet.has(2)).toBe(true);
      expect(unionSet.has(3)).toBe(true);
      expect(unionSet.size).toBe(3);
    });

    it('should throw a TypeError if either parameter is not a Set', () => {
      expect(() => CollectionHelper.union(new Set([1]), [2])).toThrow(
        TypeError
      );
      expect(() => CollectionHelper.union([], new Set([1]))).toThrow(TypeError);
    });
  });

  describe('intersection', () => {
    it('should return the intersection of two sets', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([2, 3, 4]);
      const intersectionSet = CollectionHelper.intersection(setA, setB);
      expect(intersectionSet).toBeInstanceOf(Set);
      expect(intersectionSet.has(2)).toBe(true);
      expect(intersectionSet.has(3)).toBe(true);
      expect(intersectionSet.size).toBe(2);
    });

    it('should return an empty set when either set is null', () => {
      const result1 = CollectionHelper.intersection(null, new Set([1]));
      expect(result1.size).toBe(0);
      const result2 = CollectionHelper.intersection(new Set([1]), null);
      expect(result2.size).toBe(0);
    });

    it('should throw a TypeError if parameters are not sets', () => {
      expect(() => CollectionHelper.intersection([], new Set([1]))).toThrow(
        TypeError
      );
    });
  });

  describe('difference', () => {
    it('should return the difference between two sets (setA - setB)', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([2]);
      const diffSet = CollectionHelper.difference(setA, setB);
      expect(diffSet).toBeInstanceOf(Set);
      expect(diffSet.has(1)).toBe(true);
      expect(diffSet.has(3)).toBe(true);
      expect(diffSet.size).toBe(2);
    });

    it('should return the full set if the second set is null', () => {
      const setA = new Set([1, 2]);
      const diffSet = CollectionHelper.difference(setA, null);
      expect(diffSet.size).toBe(2);
      expect(diffSet.has(1)).toBe(true);
      expect(diffSet.has(2)).toBe(true);
    });

    it('should return an empty set if the first set is null', () => {
      const diffSet = CollectionHelper.difference(null, new Set([1]));
      expect(diffSet.size).toBe(0);
    });

    it('should throw a TypeError if parameters are not sets', () => {
      expect(() => CollectionHelper.difference([], new Set([1]))).toThrow(
        TypeError
      );
    });
  });

  describe('mergeMaps', () => {
    it('should merge two maps without a merge function (mapB overwrites)', () => {
      const mapA = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const mapB = new Map([
        ['b', 3],
        ['c', 4],
      ]);
      const merged = CollectionHelper.mergeMaps(mapA, mapB);
      expect(merged.get('a')).toBe(1);
      expect(merged.get('b')).toBe(3);
      expect(merged.get('c')).toBe(4);
      expect(merged.size).toBe(3);
    });

    it('should merge two maps with a merge function', () => {
      const mapA = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const mapB = new Map([
        ['b', 3],
        ['c', 4],
      ]);
      const mergeFn = (a, b) => a + b;
      const merged = CollectionHelper.mergeMaps(mapA, mapB, mergeFn);
      expect(merged.get('a')).toBe(1);
      expect(merged.get('b')).toBe(5);
      expect(merged.get('c')).toBe(4);
    });

    it('should throw a TypeError if either parameter is not a Map', () => {
      expect(() => CollectionHelper.mergeMaps([], new Map())).toThrow(
        TypeError
      );
      expect(() => CollectionHelper.mergeMaps(new Map(), {})).toThrow(
        TypeError
      );
    });
  });

  describe('mergeArrays', () => {
    it('should merge two arrays correctly', () => {
      const arrA = [1, 2];
      const arrB = [3, 4];
      const merged = CollectionHelper.mergeArrays(arrA, arrB);
      expect(merged).toEqual([1, 2, 3, 4]);
    });

    it('should throw a TypeError if inputs are not arrays', () => {
      expect(() => CollectionHelper.mergeArrays(1, [2])).toThrow(TypeError);
      expect(() => CollectionHelper.mergeArrays([1], '2')).toThrow(TypeError);
    });
  });

  describe('filterCollection', () => {
    it('should filter an array based on the predicate', () => {
      const array = [1, 2, 3, 4];
      const filtered = CollectionHelper.filterCollection(
        array,
        (x) => x % 2 === 0
      );
      expect(filtered).toEqual([2, 4]);
    });

    it('should filter a set based on the predicate', () => {
      const set = new Set([1, 2, 3, 4]);
      const filtered = CollectionHelper.filterCollection(set, (x) => x > 2);
      expect(filtered).toBeInstanceOf(Set);
      expect(filtered.has(3)).toBe(true);
      expect(filtered.has(4)).toBe(true);
      expect(filtered.size).toBe(2);
    });

    it('should throw a TypeError if the predicate is not a function', () => {
      expect(() => CollectionHelper.filterCollection([1, 2], null)).toThrow(
        TypeError
      );
    });

    it('should throw a TypeError if the collection is not supported', () => {
      expect(() => CollectionHelper.filterCollection({}, (x) => x)).toThrow(
        TypeError
      );
    });
  });

  describe('transformCollection', () => {
    it('should transform an array correctly', () => {
      const array = [1, 2, 3];
      const transformed = CollectionHelper.transformCollection(
        array,
        (x) => x * 2
      );
      expect(transformed).toEqual([2, 4, 6]);
    });

    it('should transform a set correctly', () => {
      const set = new Set([1, 2, 3]);
      const transformed = CollectionHelper.transformCollection(
        set,
        (x) => x + 1
      );
      expect(transformed).toBeInstanceOf(Set);
      expect(transformed.has(2)).toBe(true);
      expect(transformed.has(3)).toBe(true);
      expect(transformed.has(4)).toBe(true);
      expect(transformed.size).toBe(3);
    });

    it('should throw a TypeError if transform function is not a function', () => {
      expect(() => CollectionHelper.transformCollection([1, 2], null)).toThrow(
        TypeError
      );
    });

    it('should throw a TypeError if the collection type is unsupported', () => {
      expect(() => CollectionHelper.transformCollection({}, (x) => x)).toThrow(
        TypeError
      );
    });
  });

  describe('sortArray', () => {
    it('should return a sorted copy of the array without modifying the original', () => {
      const array = [3, 1, 2];
      const sorted = CollectionHelper.sortArray(array, (a, b) => a - b);
      expect(sorted).toEqual([1, 2, 3]);
      expect(array).toEqual([3, 1, 2]); // ensure original is not modified
    });

    it('should throw a TypeError if the input is not an array', () => {
      expect(() => CollectionHelper.sortArray(123)).toThrow(TypeError);
    });
  });

  describe('bulk operations', () => {
    it('addAllToSet should add new elements and return true, or false if no change', () => {
      const setA = new Set([1]);
      const result1 = CollectionHelper.addAllToSet(setA, [2, 3]);
      expect(result1).toBe(true);
      expect(setA.size).toBe(3);
      expect(setA.has(2)).toBe(true);
      // Adding duplicate elements should return false
      const result2 = CollectionHelper.addAllToSet(setA, [1, 2]);
      expect(result2).toBe(false);
      expect(setA.size).toBe(3);
    });

    it('removeAllFromSet should remove specified elements and return true, or false if no removal', () => {
      const setB = new Set([1, 2, 3]);
      const result1 = CollectionHelper.removeAllFromSet(setB, [2, 4]);
      expect(result1).toBe(true);
      expect(setB.size).toBe(2);
      expect(setB.has(2)).toBe(false);
      const result2 = CollectionHelper.removeAllFromSet(setB, [5, 6]);
      expect(result2).toBe(false);
      expect(setB.size).toBe(2);
    });

    it('retainAllInSet should retain only the provided elements and return true if modified', () => {
      const setC = new Set([1, 2, 3, 4]);
      const result1 = CollectionHelper.retainAllInSet(setC, [2, 3, 5]);
      expect(result1).toBe(true);
      expect(setC.size).toBe(2);
      expect(setC.has(2)).toBe(true);
      expect(setC.has(3)).toBe(true);
      const setD = new Set([1, 2]);
      const result2 = CollectionHelper.retainAllInSet(setD, [1, 2, 3]);
      expect(result2).toBe(false);
      expect(setD.size).toBe(2);
    });

    it('should throw a TypeError for bulk operations if the first parameter is not a Set', () => {
      expect(() => CollectionHelper.addAllToSet([], [1])).toThrow(TypeError);
      expect(() => CollectionHelper.removeAllFromSet([], [1])).toThrow(
        TypeError
      );
      expect(() => CollectionHelper.retainAllInSet([], [1])).toThrow(TypeError);
    });
  });

  describe('getSize', () => {
    it('should return the length for arrays', () => {
      expect(CollectionHelper.getSize([1, 2, 3])).toBe(3);
    });
    it('should return the size for sets', () => {
      expect(CollectionHelper.getSize(new Set([1, 2, 3, 4]))).toBe(4);
    });
    it('should return the size for maps', () => {
      expect(
        CollectionHelper.getSize(
          new Map([
            ['a', 1],
            ['b', 2],
          ])
        )
      ).toBe(2);
    });
    it('should throw a TypeError for unsupported collection types', () => {
      expect(() => CollectionHelper.getSize({})).toThrow(TypeError);
    });
  });

  describe('getReadOnlyCollection', () => {
    it('should return a frozen array when given an array input', () => {
      const array = [1, 2, 3];
      const readonlyArray = CollectionHelper.getReadOnlyCollection(array);
      expect(Object.isFrozen(readonlyArray)).toBe(true);
      expect(readonlyArray).toEqual([1, 2, 3]);
      expect(() => {
        readonlyArray.push(4);
      }).toThrow();
    });

    it('should return a read-only set when given a set input', () => {6
      const set = new Set([1, 2, 3]);
      const readonlySet = CollectionHelper.getReadOnlyCollection(set);
      expect(readonlySet instanceof Set).toBe(true);
      expect(readonlySet.has(1)).toBe(true);
      expect(() => {
        readonlySet.add(4);
      }).toThrow();
    });

    it('should return a read-only map when given a map input', () => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const readonlyMap = CollectionHelper.getReadOnlyCollection(map);
      expect(readonlyMap instanceof Map).toBe(true);
      expect(readonlyMap.get('a')).toBe(1);
      expect(() => {
        readonlyMap.set('c', 3);
      }).toThrow();
    });

    it('should throw a TypeError for unsupported collection types', () => {
      expect(() => CollectionHelper.getReadOnlyCollection({ a: 1 })).toThrow(
        TypeError
      );
    });
  });
});