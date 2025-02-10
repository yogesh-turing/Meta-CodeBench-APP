class SearchObject {
    constructor(obj) {
        this.obj = obj;
    }

    search(searchTerm, searchType = 'both') {
        searchTerm = this.stringConversion(searchTerm);
        const results = [];
        const visited = new Set();

        this.searchRecursive(this.obj, searchTerm, searchType, results, visited, 0);

        return results;
    }

    searchRecursive(obj, searchTerm, searchType, results, visited, depth) {
        if (!obj || typeof obj !== 'object' || visited.has(obj)) return;

        visited.add(obj);

        const entries = Array.isArray(obj) 
            ? Object.keys(obj).map(key => [key, obj[key]])
            : Object.entries(obj);

        for (const [key, value] of entries) {
            if (this.isMatch(key, value, searchTerm, searchType)) {
                results.push({ key, value, depth, matchType: this.getMatchType(key, value, searchTerm, searchType) });
            }

            if (value && typeof value === 'object') {
                this.searchRecursive(value, searchTerm, searchType, results, visited, depth + 1);
            }
        }
    }

    isMatch(key, value, searchTerm, searchType) {
        if (searchType === 'key') {
            return this.compareValues(key, searchTerm);
        } else if (searchType === 'value') {
            return this.compareValues(value, searchTerm);
        } else {
            return this.compareValues(key, searchTerm) || this.compareValues(value, searchTerm);
        }
    }

    compareValues(value, searchTerm) {
        const valueStr = this.stringConversion(value);
        const valueLower = valueStr.toLowerCase();

        return value === searchTerm || valueLower === searchTerm.toLowerCase() || valueStr === searchTerm;
    }

    getMatchType(key, value, searchTerm, searchType) {
        const matchType = [];

        if (searchType === 'key' || searchType === 'both') {
            if (this.compareValues(key, searchTerm)) {
                matchType.push('key');
            }
        }

        if (searchType === 'value' || searchType === 'both') {
            if (this.compareValues(value, searchTerm)) {
                matchType.push('value');
            }
        }

        return matchType;
    }

    stringConversion(value) {
        return value === null ? 'null' 
            : value === undefined ? 'undefined' 
            : String(value).toString();
    }
}

module.exports = {
    SearchObject
};