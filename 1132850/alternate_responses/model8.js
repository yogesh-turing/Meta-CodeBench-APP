class SearchObject {
  /**
   * Compare two values to see if they are the same
   * @param {*} value1
   * @param {*} value2
   * @returns {Boolean}
   */
  compareValues(value1, value2) {
    return String(value1) === String(value2) || String(value1).toLowerCase() === String(value2).toLowerCase();
  }

  /**
   * Check if a key-value pair matches a search term
   * @param {Object} entry - key-value pair
   * @param {*} searchTerm
   * @param {String} searchType - 'key', 'value', or 'both'
   * @returns {Boolean}
   */
  isMatch(entry, searchTerm, searchType) {
    const [key, value] = entry;
    if (searchType === 'key' || searchType === 'both') {
      return this.compareValues(key, searchTerm);
    }
    if (searchType === 'value' || searchType === 'both') {
      return this.compareValues(value, searchTerm);
    }
    return false;
  }

  /**
   * Recursively search for a term in an object
   * @param {Object} obj
   * @param {*} searchTerm
   * @param {String} searchType - 'key', 'value', or 'both'
   * @param {Number} depth - current depth of search
   * @param {Set} visited - set of visited objects
   * @returns {Array} - array of matches
   */
  search(obj, searchTerm, searchType, depth = 0, visited = new Set()) {
    const results = [];
    if (!obj || typeof obj !== 'object' || visited.has(obj)) return results;
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
   * Convert a value to a string and normalize it
   * @param {*} value
   * @returns {String}
   */
  stringConversion(value) {
    return String(value).toLowerCase();
  }

  /**
   * Search for a term in an object
   * @param {Object} obj
   * @param {*} searchTerm
   * @param {String} searchType - 'key', 'value', or 'both'
   * @returns {Array} - array of matches
   */
  searchInObject(obj, searchTerm, searchType) {
    const normalizedSearchTerm = this.stringConversion(searchTerm);
    return this.search(obj, normalizedSearchTerm, searchType);
  }
}

module.exports = {
  SearchObject
};