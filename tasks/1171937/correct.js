'use strict';
class ReadOnlySet extends Set {
  constructor(iterable) {
    super();
    if (iterable) {
      for (const item of iterable) {
        super.add(item);
      }
    }
  }
  add(value) {
    throw new Error('Cannot modify read-only Set');
  }
  delete(value) {
    throw new Error('Cannot modify read-only Set');
  }
  clear() {
    throw new Error('Cannot modify read-only Set');
  }
}

class ReadOnlyMap extends Map {
  constructor(iterable) {
    super();
    if (iterable) {
      for (const [key, value] of iterable) {
        super.set(key, value);
      }
    }
  }
  set(key, value) {
    throw new Error('Cannot modify read-only Map');
  }
  delete(key) {
    throw new Error('Cannot modify read-only Map');
  }
  clear() {
    throw new Error('Cannot modify read-only Map');
  }
}

class CollectionHelper {
  static addToSet(set, element) {
    if (!(set instanceof Set)) {
      throw new TypeError('Provided collection is not a Set');
    }
    const sizeBefore = set.size;
    set.add(element);
    return set.size > sizeBefore;
  }

  static removeFromSet(set, element) {
    if (!(set instanceof Set)) {
      throw new TypeError('Provided collection is not a Set');
    }
    return set.delete(element);
  }

  static union(setA, setB) {
    if (!(setA instanceof Set) || !(setB instanceof Set)) {
      throw new TypeError('Both parameters must be Set instances');
    }
    return new Set([...setA, ...setB]);
  }

  static intersection(setA, setB) {
    if (setA == null) setA = new Set();
    if (setB == null) setB = new Set();
    if (!(setA instanceof Set) || !(setB instanceof Set)) {
      throw new TypeError('Both parameters must be Set instances or null');
    }
    const result = new Set();
    for (const item of setA) {
      if (setB.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  static difference(setA, setB) {
    if (setA == null) setA = new Set();
    if (setB == null) setB = new Set();
    if (!(setA instanceof Set) || !(setB instanceof Set)) {
      throw new TypeError('Both parameters must be Set instances or null');
    }
    const result = new Set();
    for (const item of setA) {
      if (!setB.has(item)) {
        result.add(item);
      }
    }
    return result;
  }

  static mergeMaps(mapA, mapB, mergeFunction) {
    if (!(mapA instanceof Map) || !(mapB instanceof Map)) {
      throw new TypeError('Both parameters must be Map instances');
    }
    const result = new Map();
    for (const [key, value] of mapA.entries()) {
      result.set(key, value);
    }
    for (const [key, value] of mapB.entries()) {
      if (result.has(key)) {
        result.set(
          key,
          typeof mergeFunction === 'function'
            ? mergeFunction(result.get(key), value, key)
            : value
        );
      } else {
        result.set(key, value);
      }
    }
    return result;
  }

  static mergeArrays(arrA, arrB) {
    if (!Array.isArray(arrA) || !Array.isArray(arrB)) {
      throw new TypeError('Both parameters must be Arrays');
    }
    return [...arrA, ...arrB];
  }

  static filterCollection(collection, predicate) {
    if (typeof predicate !== 'function') {
      throw new TypeError('Predicate must be a function');
    }
    if (Array.isArray(collection)) {
      return collection.filter(predicate);
    } else if (collection instanceof Set) {
      const result = new Set();
      for (const item of collection) {
        if (predicate(item)) {
          result.add(item);
        }
      }
      return result;
    }
    throw new TypeError('Collection must be an Array or Set');
  }

  static transformCollection(collection, transformFunction) {
    if (typeof transformFunction !== 'function') {
      throw new TypeError('Transform function must be a function');
    }
    if (Array.isArray(collection)) {
      return collection.map(transformFunction);
    } else if (collection instanceof Set) {
      const result = new Set();
      for (const item of collection) {
        result.add(transformFunction(item));
      }
      return result;
    }
    throw new TypeError('Collection must be an Array or Set');
  }

  static sortArray(array, comparator) {
    if (!Array.isArray(array)) {
      throw new TypeError('Input must be an Array');
    }
    const newArray = array.slice();
    newArray.sort(comparator);
    return newArray;
  }

  static addAllToSet(set, elements) {
    if (!(set instanceof Set)) {
      throw new TypeError('First parameter must be a Set');
    }
    let modified = false;
    for (const elem of elements) {
      if (!set.has(elem)) {
        set.add(elem);
        modified = true;
      }
    }
    return modified;
  }

  static removeAllFromSet(set, elements) {
    if (!(set instanceof Set)) {
      throw new TypeError('First parameter must be a Set');
    }
    let modified = false;
    for (const elem of elements) {
      if (set.delete(elem)) {
        modified = true;
      }
    }
    return modified;
  }

  static retainAllInSet(set, elements) {
    if (!(set instanceof Set)) {
      throw new TypeError('First parameter must be a Set');
    }
    const toRetain = new Set(elements);
    let modified = false;
    for (const item of set) {
      if (!toRetain.has(item)) {
        set.delete(item);
        modified = true;
      }
    }
    return modified;
  }

  static getSize(collection) {
    if (Array.isArray(collection)) {
      return collection.length;
    } else if (collection instanceof Set || collection instanceof Map) {
      return collection.size;
    }
    throw new TypeError('Collection must be an Array, Set, or Map');
  }

  static getReadOnlyCollection(collection) {
    if (Array.isArray(collection)) {
      return Object.freeze([...collection]);
    } else if (collection instanceof Set) {
      return new ReadOnlySet(collection);
    } else if (collection instanceof Map) {
      return new ReadOnlyMap(collection);
    }
    throw new TypeError('Collection must be an Array, Set, or Map');
  }
}

module.exports = { CollectionHelper };