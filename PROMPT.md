Base Code:
```javascript
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

model.exports = { searchInObject };
```


Prompt:
I need you to refactor my implementation for searching for items in large, complex objects. The refactored code should meet the following requirements:
 - Create a proper class structure called `searchObject` with methods for the different search types
 - Break the code down into smaller, focused functions. The functions should be: 
      - A function called `compareValues` which will take any 2 values and perform a comparison to see if they are the same.
      - A function called `isMatch` function. It should take an object with a key-value pair called `entry`,  a search term called `searchTerm` and the search type `searchType` . The function should return a boolean indicating if there is a match
      - A function called `search` that holds the search logic; it should take the search object of key  input called `obj`,  `searchTerm` and `searchType` as parameters and should return the result of the search. The function should be recursive
 - Provide brief and structured comments before every function
 - Replace visited array with Set to improve lookup from O(n) to O(1)
 - Move both the string conversion and normalization logic of `searchTerm` to a function called `stringConversion`. This function should take a value and should  ensure the value is converted to a string and returned in lowercase