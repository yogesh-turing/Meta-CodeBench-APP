class SearchObject {
    constructor() {
        this.visited = new Set();
        this.results = [];
    }

    /**
     * Converts any value to its string representation
     * @param {*} value - Value to convert
     * @returns {string} Normalized string representation
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
     * @returns {boolean} True if values are equal
     */
    compareValues(value1, value2) {
        if (value1 === value2) return true;
        const str1 = this.stringConversion(value1);
        const str2 = this.stringConversion(value2);
        return str1 === str2;
    }

    /**
     * Determines if there's a match based on search criteria
     * @param {string} key - Object key
     * @param {*} value - Object value
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @returns {string[]} Array of match types found
     */
    isMatch(key, value, searchTerm, searchType) {
        const matches = [];
        
        if (searchType === 'key' || searchType === 'both') {
            if (this.compareValues(key, searchTerm)) {
                matches.push('key');
            }
        }
        
        if (searchType === 'value' || searchType === 'both') {
            // Skip numeric index matches when searching by value
            if (searchType === 'value' && !isNaN(key) && !isNaN(searchTerm)) {
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
     * @param {Object|Array} obj - Object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, or both)
     * @param {number} depth - Current depth in object tree
     */
    searchRecursive(obj, searchTerm, searchType, depth) {
        if (!obj || typeof obj !== 'object' || this.visited.has(obj)) return;
        
        this.visited.add(obj);
        
        const entries = Array.isArray(obj) 
            ? Object.entries(obj)
            : Object.entries(obj);
            
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
     * @param {Object|Array} obj - Object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} [searchType='both'] - Type of search (key, value, or both)
     * @returns {Array} Array of search results
     */
    search(obj, searchTerm, searchType = 'both') {
        if (!obj || typeof obj !== 'object') return [];
        
        this.visited = new Set();
        this.results = [];
        
        this.searchRecursive(obj, searchTerm, searchType, 0);
        
        return [...this.results];
    }
}

module.exports = { SearchObject };