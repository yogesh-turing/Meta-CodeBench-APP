/**
 * SearchObject class for searching through complex objects
 * with improved performance and maintainability
 */
class SearchObject {
    constructor() {
        this.visited = new Set();
        this.stringCache = new Map();
    }

    /**
     * Normalize any value to a lowercase string representation
     * @param {*} val - Value to normalize
     * @returns {string} Normalized string value
     */
    static normalize(val) {
        if (val === null) return 'null';
        if (val === undefined) return 'undefined';
        return String(val).toLowerCase();
    }

    /**
     * Compare two values for equality after normalization
     * @param {*} val1 - First value to compare
     * @param {*} val2 - Second value to compare
     * @returns {boolean} True if values are equal after normalization
     */
    compareValues(val1, val2) {
        if (val1 === val2) return true;
        const str1 = this.stringConversion(val1);
        const str2 = this.stringConversion(val2);
        return str1 === str2;
    }

    /**
     * Convert and cache search term strings
     * @param {*} term - Term to convert
     * @returns {string} Converted string
     */
    stringConversion(term) {
        if (this.stringCache.has(term)) {
            return this.stringCache.get(term);
        }
        const converted = SearchObject.normalize(term);
        this.stringCache.set(term, converted);
        return converted;
    }

    /**
     * Check if an entry matches the search criteria
     * @param {Object} entry - Entry to check
     * @param {string} searchTerm - Term to search for
     * @param {string} searchType - Type of search (key, value, both)
     * @returns {boolean} True if entry matches
     */
    isMatch(entry, searchTerm, searchType) {
        if (searchType === 'key') {
            return this.compareValues(entry.key, searchTerm);
        } else if (searchType === 'value') {
            return this.compareValues(entry.value, searchTerm);
        } else {
            return this.compareValues(entry.key, searchTerm) || this.compareValues(entry.value, searchTerm);
        }
    }

    /**
     * Process a single entry and create result object
     * @param {string} key - Entry key
     * @param {*} value - Entry value
     * @param {number} depth - Current depth in object
     * @param {string} matchType - Type of match found
     * @returns {Object} Processed entry result
     */
    processEntry(key, value, depth, matchType) {
        return {
            key: String(key),
            value,
            depth,
            matchType: Array.isArray(matchType) ? matchType : [matchType]
        };
    }

    /**
     * Get visited Set for testing
     * @returns {Set} The visited Set
     */
    getVisited() {
        return this.visited;
    }

    search(obj, searchTerm, searchType = 'both') {
        if (!obj || typeof obj !== 'object') return [];
        
        // Clear state for new search
        this.visited = new Set();
        this.stringCache = new Map();
        
        return this._search(obj, searchTerm, searchType);
    }

    _search(obj, searchTerm, searchType) {
        if (!obj || typeof obj !== 'object' || this.visited.has(obj)) return [];
        this.visited.add(obj);
        
        const results = [];
        
        if (Array.isArray(obj)) {
            // Handle arrays
            for (let i = 0; i < obj.length; i++) {
                const entry = { key: String(i), value: obj[i] };
                if (this.isMatch(entry, searchTerm, searchType)) {
                    const matchTypes = [];
                    if (searchType === 'both') {
                        if (this.compareValues(entry.key, searchTerm)) {
                            matchTypes.push('key');
                        }
                        if (this.compareValues(entry.value, searchTerm)) {
                            matchTypes.push('value');
                        }
                    } else {
                        matchTypes.push(searchType);
                    }
                    results.push({
                        ...entry,
                        depth: this.visited.size - 1,
                        matchType: matchTypes
                    });
                }
                
                // Recursively search nested objects/arrays
                if (obj[i] && typeof obj[i] === 'object') {
                    results.push(...this._search(obj[i], searchTerm, searchType));
                }
            }
        } else {
            // Handle objects
            for (const [key, value] of Object.entries(obj)) {
                const entry = { key, value };
                if (this.isMatch(entry, searchTerm, searchType)) {
                    const matchTypes = [];
                    if (searchType === 'both') {
                        if (this.compareValues(entry.key, searchTerm)) {
                            matchTypes.push('key');
                        }
                        if (this.compareValues(entry.value, searchTerm)) {
                            matchTypes.push('value');
                        }
                    } else {
                        matchTypes.push(searchType);
                    }
                    results.push({
                        ...entry,
                        depth: this.visited.size - 1,
                        matchType: matchTypes
                    });
                }
                
                // Recursively search nested objects/arrays
                if (value && typeof value === 'object') {
                    results.push(...this.search(value, searchTerm, searchType));
                }
            }
        }
        
        // Clear visited set after top-level search completes
        if (this.visited.size === 1) {
            this.visited.clear();
        }
        
        return results;
    }
}

module.exports = {
    SearchObject
};