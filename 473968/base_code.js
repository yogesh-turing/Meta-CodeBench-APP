function autoCompleteWords() {
    // TODO: Implement Trie data structure for storing words
    
    return {
        insertWord: function(word) {
            // TODO: Insert a word 
        },
        getSuggestions: function(prefix, limit) {
            // TODO: Retrieve words matching the prefix 
            return [];
        },
        removeWord: function(word) {
            // TODO: Remove a word 
        }
    };
}

module.exports = { autoCompleteWords };