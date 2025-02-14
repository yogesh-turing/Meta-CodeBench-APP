class SearchObject {
    constructor() {
        this.visited = new Set();
    }

    /**
     * Converts any value to a lowercase string
     * @param {*} value - The value to convert
     * @returns {string} - Lowercase string representation
     */
    stringConversion(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        return String(value).toLowerCase();
    }

    /**
     * Compares two values for equality
     * @param {*} value1 - First value to compare
     * @param {*} value2 - Second value to compare
     * @returns {boolean} - True if values match
     */
    compareValues(value1, value2) {
        const str1 = this.stringConversion(value1);
        const str2 = this.stringConversion(value2);
        
        return value1 === value2 || str1 === str2;
    }

    /**
     * Checks if an entry matches the search criteria
     * @param {Object} entry - Key-value pair to check
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @returns {string[]} - Array of match types (key and/or value)
     */
    isMatch(entry, searchTerm, searchType) {
        const matches = [];
        const { key, value } = entry;

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
     * Recursively searches through an object
     * @param {Object} obj - Object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @param {number} depth - Current depth in object
     * @returns {Array} - Array of matching results
     */
    search(obj, searchTerm, searchType = 'both', depth = 0) {
        if (!obj || typeof obj !== 'object' || this.visited.has(obj)) {
            return [];
        }

        this.visited.add(obj);
        const results = [];

        const entries = Array.isArray(obj)
            ? [...Array(obj.length).keys()].map(i => ({ key: String(i), value: obj[i] }))
            : Object.entries(obj).map(([key, value]) => ({ key, value }));

        for (const entry of entries) {
            const matches = this.isMatch(entry, searchTerm, searchType);
            
            if (matches.length > 0) {
                results.push({
                    key: entry.key,
                    value: entry.value,
                    depth,
                    matchType: matches
                });
            }

            if (entry.value && typeof entry.value === 'object') {
                results.push(...this.search(entry.value, searchTerm, searchType, depth + 1));
            }
        }

        return results;
    }

    /**
     * Main search method
     * @param {Object} obj - Object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @returns {Array} - Array of matching results
     */
    searchInObject(obj, searchTerm, searchType = 'both') {
        this.visited.clear(); // Reset visited Set for new search
        return this.search(obj, searchTerm, String(searchType));
    }
}

module.exports = { SearchObject };