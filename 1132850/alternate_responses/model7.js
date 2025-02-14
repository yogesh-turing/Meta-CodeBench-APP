class SearchObject {
    /**
     * Compares two values to see if they are the same.
     * 
     * @param {*} value1 
     * @param {*} value2 
     * @returns {boolean}
     */
    compareValues(value1, value2) {
      const value1Str = String(value1).toLowerCase();
      const value2Str = String(value2).toLowerCase();
      return value1Str === value2Str;
    }
  
    /**
     * Checks if an entry (key-value pair) matches a search term.
     * 
     * @param {Object} entry 
     * @param {*} searchTerm 
     * @param {string} searchType 
     * @returns {boolean}
     */
    isMatch(entry, searchTerm, searchType) {
      const { key, value } = entry;
      const searchTermStr = this.stringConversion(searchTerm);
      const keyStr = this.stringConversion(key);
      const valueStr = this.stringConversion(value);
  
      if (searchType === 'key' || searchType === 'both') {
        if (keyStr === searchTermStr) return true;
      }
  
      if (searchType === 'value' || searchType === 'both') {
        if (valueStr === searchTermStr) return true;
      }
  
      return false;
    }
  
    /**
     * Converts a value to a string and returns it in lowercase.
     * 
     * @param {*} value 
     * @returns {string}
     */
    stringConversion(value) {
      return String(value).toLowerCase();
    }
  
    /**
     * Recursively searches an object for a search term.
     * 
     * @param {Object} obj 
     * @param {*} searchTerm 
     * @param {string} searchType 
     * @param {number} depth 
     * @param {Set} visited 
     * @param {Array} results 
     * @returns {Array}
     */
    search(obj, searchTerm, searchType, depth = 0, visited = new Set(), results = []) {
      if (!obj || typeof obj !== 'object') return results;
  
      if (visited.has(obj)) return results;
      visited.add(obj);
  
      const entries = Array.isArray(obj) 
        ? [...Array(obj.length).keys()].map(i => [String(i).toString(), obj[i]])
        : Object.entries(obj);
  
      for (const entry of entries) {
        if (this.isMatch(entry, searchTerm, searchType)) {
          results.push({ 
            key: entry[0],
            value: entry[1],
            depth,
            matchType: searchType
          });
        }
  
        if (entry[1] && typeof entry[1] === 'object') {
          this.search(entry[1], searchTerm, searchType, depth + 1, visited, results);
        }
      }
  
      return results;
    }
  }
  
  module.exports = {
    SearchObject
  };