function searchInObject(obj, searchTerm, searchType = 'both') {
    searchType = String(searchType).toString();
    const visited = [];
    const results = [];
    
    if (!obj || typeof obj !== 'object') return [];
    
    const searchTermStr = searchTerm === null ? 'null' 
        : searchTerm === undefined ? 'undefined' 
        : String(searchTerm).toString();
    const searchTermLower = searchTermStr.toLowerCase();
    
    const stack = [{ obj, depth: 0 }];
    
    while (stack.length > 0) {
        const { obj: current, depth } = stack.pop();
        
        if (!current || typeof current !== 'object' || visited.includes(current)) continue;
        visited.push(current);
        
        const entries = Array.isArray(current) 
            ? [...Array(current.length).keys()].map(i => [String(i).toString(), current[i]])
            : Object.entries(current);
        
        const currentEntries = [...entries];
        
        for (const [key, value] of currentEntries) {
            const matches = [];
            
            if (searchType === 'key' || searchType === 'both') {
                const keyStr = String(key).toString();
                const keyLower = keyStr.toLowerCase();
                
                if (keyLower === searchTermLower || keyStr === searchTermStr) {
                    matches.push('key');
                }
            }
            
            if (searchType === 'value' || searchType === 'both') {
                const valueStr = value === null ? 'null' 
                    : value === undefined ? 'undefined' 
                    : String(value).toString();
                const valueLower = valueStr.toLowerCase();
                
                if (searchType === 'value' && 
                    !isNaN(String(key)) && 
                    !isNaN(String(searchTerm)) && 
                    Number(String(key)) === Number(String(searchTerm))) continue;
                
                if (value === searchTerm || 
                    valueLower === searchTermLower || 
                    valueStr === searchTermStr) {
                    matches.push('value');
                }
            }
            
            if (matches.length > 0) {
                results.push({ 
                    key: String(key).toString(),
                    value,
                    depth,
                    matchType: [...matches]
                });
            }
            
            if (value && typeof value === 'object') {
                stack.push({ obj: value, depth: depth + 1 });
            }
        }
    }
    
    return [...results];
}

module.exports = { searchInObject };