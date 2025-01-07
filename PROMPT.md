Base Code:
```javascript
/**
 * Implements a search autocomplete system.
 * 
 * @param {string[]} keywords - List of available keywords with their frequencies, each represented as:
 *   - {string} keyword: The search keyword.
 *   - {number} frequency: The frequency of the keyword.
 * @param {string} prefix - The prefix string to search for.
 * @param {number} k - Number of top suggestions to return.
 * @returns {Object[]} - Array of top k suggestions, each containing:
 *   - {string} keyword: The keyword.
 *   - {number} frequency: The frequency of the keyword.
 */
function autocomplete(keywords, prefix, k) {

    if (!keywords || keywords.length === 0) {
        return [];
    }

    if (!prefix) {
        return [];
    }

    if (k <= 0) {
        return [];
    }

    // TODO - complete the function
    // Filter keywords that start with the given prefix
    // Sort the filtered keywords by frequency in descending order
    // Return the top k suggestions
}

module.exports = {
    autocomplete
};
```

Prompt:
Please help to complete the function
The function should implement a search autocomplete system. The system should take a prefix string and return the top k suggested keywords from a predefined list, ranked by their frequency. 
The function first should filter keywords that start with the given prefix. Then sort the filtered keywords by frequency in descending order. 
It should return the top k suggestions.
The search should be case-insensitive.
In addition to prefix matches, it should allow partial matches anywhere in the keyword.