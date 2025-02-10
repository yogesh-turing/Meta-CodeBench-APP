class SearchObject {
    constructor(obj) {
        this.obj = obj;
        this.searchTerm = null;
        this.searchType = null;
        this.results = [];
    }

    compareValues(value, searchTerm) {
        const valueStr = value === null ? 'null' 
            : value === undefined ? 'undefined' 
            : String(value).toString();
        const valueLower = valueStr.toLowerCase();
        const searchTermStr = String(searchTerm).toString();
        const searchTermLower = searchTermStr.toLowerCase();

        return value === searchTerm || 
            valueLower === searchTermLower || 
            valueStr === searchTermStr;
    }

    isMatch(key, value, searchTerm, searchType) {
        const matches = [];

        if (searchType === 'key' || searchType === 'both') {
            const keyStr = String(key).toString();
            const keyLower = keyStr.toLowerCase();

            if (keyLower === searchTerm.toLowerCase() || keyStr === searchTerm) {
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

    search(obj, searchTerm, searchType, depth = 0, visited = new Set()) {
        if (!obj || typeof obj !== 'object' || visited.has(obj)) return;

        visited.add(obj);

        const entries = Array.isArray(obj) 
            ? obj.map((value, index) => [index, value])
            : Object.entries(obj);

        for (const [key, value] of entries) {
            const matches = this.isMatch(key, value, searchTerm, searchType);

            if (matches.length > 0) {
                this.results.push({ 
                    key: String(key).toString(),
                    value,
                    depth,
                    matchType: [...matches]
                });
            }

            if (value && typeof value === 'object') {
                this.search(value, searchTerm, searchType, depth + 1, visited);
            }
        }
    }

    stringConversion(searchTerm) {
        return String(searchTerm).toString().toLowerCase();
    }

    searchInObject(searchTerm, searchType = 'both') {
        this.searchTerm = this.stringConversion(searchTerm);
        this.searchType = searchType;
        this.results = [];
        this.search(this.obj, this.searchTerm, this.searchType);
        return [...this.results];
    }
}

// // Example usage
// const obj = {
//     a: 1,
//     b: 2,
//     c: 3,
//     d: {
//         e: 4,
//         f: 5,
//         g: 6
//     }
// };

// const search = new SearchObject(obj);
// console.log(search.searchInObject(4, 'value'));

module.exports = {
    SearchObject
};