class SearchObject {
  /**
   * Searches for a term in a complex object.
   * @param {object} obj - The object to search in.
   * @param {*} searchTerm - The term to search for.
   * @param {string} [searchType='both'] - The type of search to perform. Can be 'key', 'value', or 'both'.
   * @returns {object[]} An array of objects containing the key, value, depth, and match type of each match.
   */
  search(obj, searchTerm, searchType = 'both') {
    const results = [];
    const visited = new Set();
    const searchTermStr = this.stringConversion(searchTerm);
    const stack = [{ obj, depth: 0 }];

    while (stack.length > 0) {
      const { obj: current, depth } = stack.pop();

      if (!current || typeof current !== 'object' || visited.has(current)) continue;
      visited.add(current);

      const entries = Array.isArray(current)
        ? current.entries()
        : Object.entries(current);

      for (const [key, value] of entries) {
        const match = this.isMatch(key, value, searchTermStr, searchType);

        if (match) {
          results.push({
            key,
            value,
            depth,
            matchType: match,
          });
        }

        if (value && typeof value === 'object') {
          stack.push({ obj: value, depth: depth + 1 });
        }
      }
    }

    return results;
  }

  /**
   * Checks if a key-value pair matches the search term and type.
   * @param {string} key - The key to check.
   * @param {*} value - The value to check.
   * @param {string} searchTermStr - The search term as a string.
   * @param {string} searchType - The type of search to perform.
   * @returns {string[]|null} An array of match types if the key-value pair matches, or null if it doesn't.
   */
  isMatch(key, value, searchTermStr, searchType) {
    const matches = [];

    if (searchType === 'key' || searchType === 'both') {
      if (this.compareValues(key, searchTermStr)) {
        matches.push('key');
      }
    }

    if (searchType === 'value' || searchType === 'both') {
      if (this.compareValues(value, searchTermStr)) {
        matches.push('value');
      }
    }

    return matches.length > 0 ? matches : null;
  }

  /**
   * Compares two values for equality.
   * @param {*} value1 - The first value to compare.
   * @param {*} value2 - The second value to compare.
   * @returns {boolean} True if the values are equal, false otherwise.
   */
  compareValues(value1, value2) {
    if (value1 === null || value1 === undefined) {
      return value1 === value2;
    }

    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 === value2;
    }

    return String(value1).toLowerCase() === String(value2).toLowerCase();
  }

  /**
   * Converts a value to a string and normalizes it for comparison.
   * @param {*} value - The value to convert.
   * @returns {string} The converted and normalized string.
   */
  stringConversion(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return String(value).toLowerCase();
  }
}

module.exports = {
  SearchObject
};