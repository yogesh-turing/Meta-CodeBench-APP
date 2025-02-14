class SearchObject {
    constructor() {
        this.visited = new Set();
    }

    /**
     * Converts any value to a normalized string representation
     * @param {*} value - The value to convert
     * @returns {string} - Normalized lowercase string
     */
    stringConversion(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        return String(value).toLowerCase();
    }

    /**
     * Compares two values for equality considering different data types
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
     * @param {Object} entry - Object containing key and value
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
            // Skip numeric index matching when searching by value
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
     * Performs recursive search through object
     * @param {Object} obj - Object to search in
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @param {number} depth - Current depth in object tree
     * @returns {Array} - Array of matching results
     */
    search(obj, searchTerm, searchType = 'both', depth = 0) {
        if (!obj || typeof obj !== 'object' || this.visited.has(obj)) {
            return [];
        }

        this.visited.add(obj);
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
                results.push(...this.search(value, searchTerm, searchType, depth + 1));
            }
        }

        return results;
    }

    /**
     * Main search method that initializes the search process
     * @param {Object} obj - Object to search in
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @returns {Array} - Array of search results
     */
    searchInObject(obj, searchTerm, searchType = 'both') {
        this.visited.clear(); // Reset visited Set for new search
        if (!obj || typeof obj !== 'object') return [];
        
        return this.search(obj, searchTerm, String(searchType));
    }
}

module.exports = { SearchObject };