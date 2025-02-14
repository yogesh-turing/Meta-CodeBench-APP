class SearchObject {
    constructor() {
        this.visited = new Set();
    }

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
     * @param {Object} entry - Object containing key and value to check
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search ('key', 'value', or 'both')
     * @returns {string[]} - Array of match types ('key' and/or 'value')
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
     * Recursively searches through an object for matching entries
     * @param {Object} obj - Object to search through
     * @param {*} searchTerm - Term to search for
     * @param {string} searchType - Type of search ('key', 'value', or 'both')
     * @param {number} depth - Current depth in the object tree
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
}

/**
 * Main search function that initializes the SearchObject and performs the search
 * @param {Object} obj - Object to search through
 * @param {*} searchTerm - Term to search for
 * @param {string} searchType - Type of search ('key', 'value', or 'both')
 * @returns {Array} - Array of search results
 */
function searchInObject(obj, searchTerm, searchType = 'both') {
    const searcher = new SearchObject();
    return searcher.search(obj, searchTerm, searchType);
}

module.exports = { searchInObject };