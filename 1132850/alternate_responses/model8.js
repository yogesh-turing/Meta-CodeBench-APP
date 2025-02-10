class SearchObject {
    /**
     * Search for items in a large, complex object.
     * @param {object} obj - The object to search in.
     * @param {string|number|boolean} searchTerm - The term to search for.
     * @param {string} searchType - The type of search to perform (key, value, or both).
     * @returns {array} An array of search results.
     */
    search(obj, searchTerm, searchType = 'both') {
      this.searchTerm = this.stringConversion(searchTerm);
      this.searchType = searchType;
      this.results = [];
      this.visited = new Set();
      this.searchRecursive(obj, 0);
      return this.results;
    }
  
    /**
     * Recursively search for the search term in the object.
     * @param {object} obj - The object to search in.
     * @param {number} depth - The current depth of the search.
     */
    searchRecursive(obj, depth) {
      if (!obj || typeof obj !== 'object' || this.visited.has(obj)) return;
      this.visited.add(obj);
  
      const entries = Array.isArray(obj)
        ? this.getArrayEntries(obj)
        : Object.entries(obj);
  
      for (const [key, value] of entries) {
        if (this.isMatch(key, value, this.searchTerm, this.searchType)) {
          this.results.push({
            key,
            value,
            depth,
            matchType: this.getMatchType(key, value, this.searchTerm, this.searchType),
          });
        }
  
        if (value && typeof value === 'object') {
          this.searchRecursive(value, depth + 1);
        }
      }
    }
  
    /**
     * Get the entries of an array.
     * @param {array} arr - The array to get the entries from.
     * @returns {array} An array of entries.
     */
    getArrayEntries(arr) {
      const entries = [];
      for (let i = 0; i < arr.length; i++) {
        entries.push([i.toString(), arr[i]]);
      }
      return entries;
    }
  
    /**
     * Check if the search term matches the key or value.
     * @param {string|number} key - The key to check.
     * @param {string|number|boolean} value - The value to check.
     * @param {string|number|boolean} searchTerm - The search term to check against.
     * @param {string} searchType - The type of search to perform (key, value, or both).
     * @returns {boolean} True if the search term matches, false otherwise.
     */
    isMatch(key, value, searchTerm, searchType) {
      if (searchType === 'key' || searchType === 'both') {
        if (this.compareValues(key, searchTerm)) return true;
      }
  
      if (searchType === 'value' || searchType === 'both') {
        if (this.compareValues(value, searchTerm)) return true;
      }
  
      return false;
    }
  
    /**
     * Get the match type (key, value, or both).
     * @param {string|number} key - The key to check.
     * @param {string|number|boolean} value - The value to check.
     * @param {string|number|boolean} searchTerm - The search term to check against.
     * @param {string} searchType - The type of search to perform (key, value, or both).
     * @returns {array} An array of match types.
     */
    getMatchType(key, value, searchTerm, searchType) {
      const matchType = [];
      if (searchType === 'key' || searchType === 'both') {
        if (this.compareValues(key, searchTerm)) matchType.push('key');
      }
  
      if (searchType === 'value' || searchType === 'both') {
        if (this.compareValues(value, searchTerm)) matchType.push('value');
      }
  
      return matchType;
    }
  
    /**
     * Compare two values for equality.
     * @param {string|number|boolean} value1 - The first value to compare.
     * @param {string|number|boolean} value2 - The second value to compare.
     * @returns {boolean} True if the values are equal, false otherwise.
     */
    compareValues(value1, value2) {
      if (value1 === null && value2 === 'null') return true;
      if (value1 === undefined && value2 === 'undefined') return true;
      if (typeof value1 === 'number' && typeof value2 === 'number') {
        return value1 === value2;
      }
      return String(value1).toLowerCase() === String(value2).toLowerCase();
    }
  
    /**
     * Convert a value to a string and normalize it.
     * @param {string|number|boolean} value - The value to convert.
     * @returns {string} The converted and normalized value.
     */
    stringConversion(value) {
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';
      return String(value).toLowerCase();
    }
  }
  
  // const searchObject = new SearchObject();
  // const obj = {
  //   a: 1,
  //   b: 'hello',
  //   c: true,
  //   d: null,
  //   e: undefined,
  //   f: {
  //     g: 2,
  //     h: 'world',
  //   },
  //   i: [
  //     3,
  //     'foo',
  //     {
  //       j: 4,
  //       k: 'bar',
  //     },
  //   ],
  // };
  
  // const searchTerm = 'hello';
  // const searchType = 'value';
  // const results = searchObject.search(obj, searchTerm, searchType);
  // print(results);

  module.exports = {
    SearchObject
  };