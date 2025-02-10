class SearchObject {
    constructor() {
        this.visited = new Set();
        this.results = [];
        // Cache array indices for common array lengths
        this.arrayIndices = new Map();
    }

    /**
     * Converts any value to its string representation
     * @param {*} value - The value to convert
     * @returns {string} - Normalized string representation
     */
    stringConversion(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        return String(value).toLowerCase();
    }

    /**
     * Compares two values for equality considering different types
     * @param {*} value1 - First value to compare
     * @param {*} value2 - Second value to compare
     * @returns {boolean} - Whether the values match
     */
    compareValues(value1, value2) {
        if (value1 === value2) return true;
        const str1 = this.stringConversion(value1);
        const str2 = this.stringConversion(value2);
        return str1 === str2;
    }

    /**
     * Gets cached array indices or creates new ones
     * @param {number} length - Length of array
     * @returns {string[]} - Array of string indices
     */
    getArrayIndices(length) {
        if (!this.arrayIndices.has(length)) {
            this.arrayIndices.set(length, 
                Array.from({ length }, (_, i) => String(i)));
        }
        return this.arrayIndices.get(length);
    }

    /**
     * Determines if an entry matches the search criteria
     * @param {string} key - Entry key
     * @param {*} value - Entry value
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @returns {string[]} - Array of match types
     */
    isMatch(key, value, searchTerm, searchType) {
        const matches = [];
        const searchTermStr = this.stringConversion(searchTerm);

        if (searchType === 'key' || searchType === 'both') {
            if (this.compareValues(key, searchTerm)) {
                matches.push('key');
            }
        }

        if (searchType === 'value' || searchType === 'both') {
            // Skip numeric index matching for value-only searches
            if (searchType === 'value' && 
                !isNaN(key) && 
                !isNaN(searchTerm) && 
                Number(key) === Number(searchTerm)) {
                return matches;
            }

            if (this.compareValues(value, searchTerm)) {
                matches.push('value');
            }
        }

        return matches;
    }

    /**
     * Recursive search function to traverse object
     * @param {Object} current - Current object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search
     * @param {number} depth - Current depth in object
     */
    searchRecursive(current, searchTerm, searchType, depth) {
        if (!current || typeof current !== 'object' || this.visited.has(current)) {
            return;
        }

        this.visited.add(current);

        const entries = Array.isArray(current)
            ? this.getArrayIndices(current.length).map(i => [i, current[i]])
            : Object.entries(current);

        for (const [key, value] of entries) {
            const matches = this.isMatch(key, value, searchTerm, searchType);

            if (matches.length > 0) {
                this.results.push({
                    key,
                    value,
                    depth,
                    matchType: matches
                });
            }

            if (value && typeof value === 'object') {
                this.searchRecursive(value, searchTerm, searchType, depth + 1);
            }
        }
    }

    /**
     * Main search function
     * @param {Object} obj - Object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @returns {Array} - Array of search results
     */
    search(obj, searchTerm, searchType = 'both') {
        if (!obj || typeof obj !== 'object') return [];

        this.visited.clear();
        this.results = [];
        
        this.searchRecursive(obj, searchTerm, searchType, 0);
        
        return [...this.results];
    }
}

module.exports = { SearchObject };