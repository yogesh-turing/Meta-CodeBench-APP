/**
 * Implements a search autocomplete system.
 * 
 * @param {Object[]} keywords - List of available keywords with their frequencies, each represented as:
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

    // Filter keywords that start with the given prefix
    const filteredKeywords = keywords.filter(keyword => keyword.keyword.startsWith(prefix));

    // Sort the filtered keywords by frequency in descending order
    const sortedKeywords = filteredKeywords.sort((a, b) => b.frequency - a.frequency);

    // Return the top k suggestions
    return sortedKeywords.slice(0, k);
}

module.exports = {
    autocomplete
};