class SearchObject {
    /**
     * Compare two values and return true if they are the same.
     * @param {*} value1 - The first value to compare.
     * @param {*} value2 - The second value to compare.
     * @returns {boolean} True if the values are the same, false otherwise.
     */
    compareValues(value1, value2) {
      const value1Str = String(value1).toString();
      const value2Str = String(value2).toString();
      const value1Lower = value1Str.toLowerCase();
      const value2Lower = value2Str.toLowerCase();
  
      return value1 === value2 || value1Lower === value2Lower || value1Str === value2Str;
    }
  
    /**
     * Check if an entry matches a search term based on the search type.
     * @param {Object} entry - An object with a key-value pair.
     * @param {*} searchTerm - The term to search for.
     * @param {string} searchType - The type of search to perform (key, value, or both).
     * @returns {boolean} True if the entry matches the search term, false otherwise.
     */
    isMatch(entry, searchTerm, searchType) {
      const { key, value } = entry;
      const keyStr = String(key).toString();
      const valueStr = value === null ? 'null' : value === undefined ? 'undefined' : String(value).toString();
      const keyLower = keyStr.toLowerCase();
      const valueLower = valueStr.toLowerCase();
      const searchTermStr = this.stringConversion(searchTerm);
      const searchTermLower = searchTermStr.toLowerCase();
  
      if (searchType === 'key' || searchType === 'both') {
        if (keyLower === searchTermLower || keyStr === searchTermStr) {
          return true;
        }
      }
  
      if (searchType === 'value' || searchType === 'both') {
        if (value === searchTerm || valueLower === searchTermLower || valueStr === searchTermStr) {
          return true;
        }
      }
  
      return false;
    }
  
    /**
     * Convert a value to a string and return it in lowercase.
     * @param {*} value - The value to convert.
     * @returns {string} The converted value.
     */
    stringConversion(value) {
      return String(value).toLowerCase();
    }
  
    /**
     * Search for a term in an object based on the search type.
     * @param {Object} obj - The object to search in.
     * @param {*} searchTerm - The term to search for.
     * @param {string} searchType - The type of search to perform (key, value, or both).
     * @param {number} depth - The current depth of the search.
     * @param {Set} visited - A set of visited objects to avoid infinite loops.
     * @returns {Array} An array of search results.
     */
    search(obj, searchTerm, searchType, depth = 0, visited = new Set()) {
      const results = [];
  
      if (!obj || typeof obj !== 'object' || visited.has(obj)) {
        return results;
      }
  
      visited.add(obj);
  
      const entries = Array.isArray(obj)
        ? [...Array(obj.length).keys()].map(i => [String(i).toString(), obj[i]])
        : Object.entries(obj);
  
      for (const entry of entries) {
        const { key, value } = entry;
  
        if (this.isMatch(entry, searchTerm, searchType)) {
          results.push({
            key: String(key).toString(),
            value,
            depth,
            matchType: searchType,
          });
        }
  
        if (value && typeof value === 'object') {
          results.push(...this.search(value, searchTerm, searchType, depth + 1, visited));
        }
      }
  
      return results;
    }
  }
  
  module.exports = {
    SearchObject
  };