class SearchObject {
    constructor() {
        this.visited = new Set();
        this.results = [];
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
     * Compares two values for equality
     * @param {*} value1 - First value to compare
     * @param {*} value2 - Second value to compare
     * @returns {boolean} - True if values are equal
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
     * @returns {string[]} - Array of match types
     */
    isMatch(key, value, searchTerm, searchType) {
        const matches = [];
        
        if (searchType === 'key' || searchType === 'both') {
            if (this.compareValues(key, searchTerm)) {
                matches.push('key');
            }
        }
        
        if (searchType === 'value' || searchType === 'both') {
            // Skip numeric index matching when searching by value
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
     * Recursive search function to traverse object
     * @param {Object} current - Current object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search
     * @param {number} depth - Current depth in object
     */
    search(current, searchTerm, searchType, depth) {
        if (!current || typeof current !== 'object' || this.visited.has(current)) {
            return;
        }
        
        this.visited.add(current);
        
        const entries = Array.isArray(current) 
            ? Object.entries(current)
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
                this.search(value, searchTerm, searchType, depth + 1);
            }
        }
    }

    /**
     * Main search method
     * @param {Object} obj - Object to search
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search (default: 'both')
     * @returns {Array} - Array of search results
     */
    searchInObject(obj, searchTerm, searchType = 'both') {
        if (!obj || typeof obj !== 'object') return [];
        
        this.visited.clear();
        this.results = [];
        
        this.search(obj, searchTerm, searchType, 0);
        
        return [...this.results];
    }
}

module.exports = { SearchObject };