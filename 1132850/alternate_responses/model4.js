class SearchObject {
    /**
     * Converts any value to a lowercase string representation
     * @param {*} value - The value to convert
     * @returns {string} - Lowercase string representation of the value
     */
    stringConversion(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        return String(value).toLowerCase();
    }

    /**
     * Compares two values for equality after string conversion
     * @param {*} value1 - First value to compare
     * @param {*} value2 - Second value to compare
     * @returns {boolean} - True if values are equal after conversion
     */
    compareValues(value1, value2) {
        const str1 = this.stringConversion(value1);
        const str2 = this.stringConversion(value2);
        return str1 === str2 || value1 === value2;
    }

    /**
     * Checks if an entry matches the search criteria
     * @param {Object} entry - Object containing key and value
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search ('key', 'value', or 'both')
     * @returns {string[]} - Array of match types ('key' and/or 'value')
     */
    isMatch({ key, value }, searchTerm, searchType) {
        const matches = [];

        if (searchType === 'key' || searchType === 'both') {
            if (this.compareValues(key, searchTerm)) {
                matches.push('key');
            }
        }

        if (searchType === 'value' || searchType === 'both') {
            // Skip numeric index matching for value searches
            if (searchType === 'value' && 
                !isNaN(String(key)) && 
                !isNaN(String(searchTerm)) && 
                Number(String(key)) === Number(String(searchTerm))) {
                return matches;
            }

            if (this.compareValues(value, searchTerm)) {
                matches.push('value');
            }
        }

        return matches;
    }

    /**
     * Recursively searches through an object for matching terms
     * @param {Object} obj - Object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search ('key', 'value', or 'both')
     * @param {number} depth - Current depth in the object
     * @param {Set} visited - Set of visited objects
     * @returns {Array} - Array of matching results
     */
    search(obj, searchTerm, searchType = 'both', depth = 0, visited = new Set()) {
        if (!obj || typeof obj !== 'object' || visited.has(obj)) {
            return [];
        }

        visited.add(obj);
        const results = [];

        const entries = Array.isArray(obj)
            ? [...Array(obj.length).keys()].map(i => [String(i), obj[i]])
            : Object.entries(obj);

        for (const [key, value] of entries) {
            const matches = this.isMatch({ key, value }, searchTerm, searchType);

            if (matches.length > 0) {
                results.push({
                    key: String(key),
                    value,
                    depth,
                    matchType: matches
                });
            }

            if (value && typeof value === 'object') {
                results.push(...this.search(value, searchTerm, searchType, depth + 1, visited));
            }
        }

        return results;
    }

    /**
     * Main search function that initializes the search process
     * @param {Object} obj - Object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search ('key', 'value', or 'both')
     * @returns {Array} - Array of search results
     */
    searchInObject(obj, searchTerm, searchType = 'both') {
        if (!obj || typeof obj !== 'object') {
            return [];
        }

        return this.search(obj, searchTerm, String(searchType), 0, new Set());
    }
}

module.exports = { SearchObject };