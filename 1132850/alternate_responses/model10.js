class SearchObject {
    /**
     * Compare two values to see if they are the same.
     * @param {any} value1 - The first value to compare.
     * @param {any} value2 - The second value to compare.
     * @returns {boolean} - True if the values are the same, false otherwise.
     */
    compareValues(value1, value2) {
      const value1Str = this.stringConversion(value1);
      const value2Str = this.stringConversion(value2);
      return value1Str === value2Str;
    }
  
    /**
     * Check if a key-value pair matches a search term.
     * @param {object} entry - The key-value pair to check.
     * @param {any} searchTerm - The search term to match.
     * @param {string} searchType - The type of search to perform (key, value, or both).
     * @returns {boolean} - True if the entry matches the search term, false otherwise.
     */
    isMatch(entry, searchTerm, searchType) {
      const { key, value } = entry;
      const searchTermStr = this.stringConversion(searchTerm);
  
      if (searchType === 'key' || searchType === 'both') {
        if (this.compareValues(key, searchTerm)) return true;
      }
  
      if (searchType === 'value' || searchType === 'both') {
        if (this.compareValues(value, searchTerm)) return true;
      }
  
      return false;
    }
  
    /**
     * Recursively search an object for matches to a search term.
     * @param {object} obj - The object to search.
     * @param {any} searchTerm - The search term to match.
     * @param {string} searchType - The type of search to perform (key, value, or both).
     * @param {number} depth - The current depth of the search.
     * @param {Set<object>} visited - A set of objects that have already been visited.
     * @returns {array} - An array of matches.
     */
    search(obj, searchTerm, searchType, depth = 0, visited = new Set()) {
      if (!obj || typeof obj !== 'object') return [];
  
      if (visited.has(obj)) return [];
      visited.add(obj);
  
      const results = [];
  
      const entries = Array.isArray(obj)
        ? [...Array(obj.length).keys()].map(i => [String(i).toString(), obj[i]])
        : Object.entries(obj);
  
      for (const entry of entries) {
        if (this.isMatch(entry, searchTerm, searchType)) {
          results.push({
            key: entry[0],
            value: entry[1],
            depth,
            matchType: [searchType]
          });
        }
  
        if (entry[1] && typeof entry[1] === 'object') {
          results.push(...this.search(entry[1], searchTerm, searchType, depth + 1, visited));
        }
      }
  
      return results;
    }
  
    /**
     * Convert a value to a string and return it in lowercase.
     * @param {any} value - The value to convert.
     * @returns {string} - The converted value.
     */
    stringConversion(value) {
      return String(value).toLowerCase();
    }
  }
  
  module.exports = {
    SearchObject
  };