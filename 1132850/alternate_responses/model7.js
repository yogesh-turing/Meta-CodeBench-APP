class SearchObject {
    /**
     * Creates a new SearchObject instance.
     */
    constructor() {
        this.visited = new Set();
        this.results = [];
    }

    /**
     * Converts a value to a string and its lowercase equivalent.
     * @param {*} value - The value to convert.
     * @returns {{str: string, lower: string}} - An object containing the string and lowercase representations.
     */
    stringConversion(value) {
        const str = value === null ? 'null' : value === undefined ? 'undefined' : String(value);
        return { str, lower: str.toLowerCase() };
    }

    /**
     * Compares two values for equality, considering string and number comparisons.
     * @param {*} value1 - The first value to compare.
     * @param {*} value2 - The second value to compare.
     * @returns {boolean} - True if the values are equal, false otherwise.
     */
    compareValues(value1, value2) {
        if (typeof value1 === 'number' && typeof value2 === 'number') {
            return value1 === value2;
        }
        const { str: str1, lower: lower1 } = this.stringConversion(value1);
        const { str: str2, lower: lower2 } = this.stringConversion(value2);
        return str1 === str2 || lower1 === lower2;
    }

    /**
     * Checks if a key-value pair matches the search term based on the search type.
     * @param {string} key - The key to check.
     * @param {*} value - The value to check.
     * @param {*} searchTerm - The search term to match.
     * @param {string} searchType - The type of search (key, value, or both).
     * @returns {string[]} - An array of match types (key, value, or both).
     */
    isMatch(key, value, searchTerm, searchType) {
        const matches = [];
        if (searchType === 'key' || searchType === 'both') {
            if (this.compareValues(key, searchTerm)) {
                matches.push('key');
            }
        }
        if (searchType === 'value' || searchType === 'both') {
            if (this.compareValues(value, searchTerm)) {
                matches.push('value');
            }
        }
        return matches;
    }

    /**
     * Recursively searches for matches in an object.
     * @param {object} obj - The object to search.
     * @param {*} searchTerm - The search term to match.
     * @param {string} searchType - The type of search (key, value, or both).
     * @param {number} depth - The current depth of the search.
     */
    search(obj, searchTerm, searchType, depth = 0) {
        if (!obj || typeof obj !== 'object' || this.visited.has(obj)) {
            return;
        }
        this.visited.add(obj);

        const { str: searchTermStr, lower: searchTermLower } = this.stringConversion(searchTerm);

        const entries = Array.isArray(obj) ? Object.entries(obj) : Object.entries(obj);

        for (const [key, value] of entries) {
            const matches = this.isMatch(key, value, searchTerm, searchType);
            if (matches.length > 0) {
                this.results.push({
                    key: String(key),
                    value,
                    depth,
                    matchType: matches,
                });
            }
            if (value && typeof value === 'object') {
                this.search(value, searchTerm, searchType, depth + 1);
            }
        }
    }

    /**
     * Searches for matches in an object and returns the results.
     * @param {object} obj - The object to search.
     * @param {*} searchTerm - The search term to match.
     * @param {string} searchType - The type of search (key, value, or both).
     * @returns {object[]} - An array of match objects.
     */
    findMatches(obj, searchTerm, searchType = 'both') {
        this.results = [];
        this.visited = new Set();
        this.search(obj, searchTerm, searchType);
        return this.results;
    }
}

// Example usage:
// const searchObject = new SearchObject();
// const obj = {
//     a: 1,
//     b: 'hello',
//     c: {
//         d: 2,
//         e: 'world',
//     },
// };
// const results = searchObject.findMatches(obj, 'hello', 'value');
// // Use the global console object
// globalThis.console.log(results);


module.exports = {
    SearchObject
};