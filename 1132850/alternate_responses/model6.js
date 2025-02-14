class SearchObject {
  /**
   * Compare two values to see if they are the same
   * @param {*} value1
   * @param {*} value2
   * @returns {boolean}
   */
  compareValues(value1, value2) {
    return String(value1).toLowerCase() === String(value2).toLowerCase();
  }

  /**
   * Check if a key-value pair matches the search term
   * @param {Object} entry - key-value pair
   * @param {*} searchTerm
   * @param {string} searchType - 'key', 'value', or 'both'
   * @returns {boolean}
   */
  isMatch(entry, searchTerm, searchType) {
    const { key, value } = entry;
    const searchTermStr = this.stringConversion(searchTerm);
    const keyStr = this.stringConversion(key);
    const valueStr = this.stringConversion(value);

    if (searchType === 'key' || searchType === 'both') {
      return keyStr === searchTermStr;
    }

    if (searchType === 'value' || searchType === 'both') {
      return valueStr === searchTermStr;
    }

    return false;
  }

  /**
   * Recursively search for matches in the object
   * @param {Object} obj
   * @param {*} searchTerm
   * @param {string} searchType - 'key', 'value', or 'both'
   * @param {number} depth
   * @param {Set} visited
   * @returns {Array} - search results
   */
  search(obj, searchTerm, searchType, depth = 0, visited = new Set()) {
    const results = [];

    if (!obj || typeof obj !== 'object') return results;

    if (visited.has(obj)) return results;
    visited.add(obj);

    const entries = Array.isArray(obj)
      ? [...Array(obj.length).keys()].map(i => [String(i), obj[i]])
      : Object.entries(obj);

    for (const entry of entries) {
      if (this.isMatch(entry, searchTerm, searchType)) {
        results.push({ key: entry[0], value: entry[1], depth, matchType: [searchType] });
      }

      if (entry[1] && typeof entry[1] === 'object') {
        results.push(...this.search(entry[1], searchTerm, searchType, depth + 1, visited));
      }
    }

    return results;
  }

  /**
   * Convert a value to a string and return it in lowercase
   * @param {*} value
   * @returns {string}
   */
  stringConversion(value) {
    return String(value).toLowerCase();
  }
}

module.exports = { SearchObject };