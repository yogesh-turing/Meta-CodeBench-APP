function autoCompleteWords() {
    class TrieNode {
        constructor() {
            this.children = new Map();
            this.isEndOfWord = false;
        }
    }

    const root = new TrieNode();

    function validateWord(word) {
        if (typeof word !== 'string' || word.length === 0) {
            throw new Error("Invalid word");
        }
    }

    function insert(node, word, index = 0) {
        if (index === word.length) {
            const isNewWord = !node.isEndOfWord;
            node.isEndOfWord = true;
            return isNewWord;
        }

        const char = word[index];
        if (!node.children.has(char)) {
            node.children.set(char, new TrieNode());
        }
        return insert(node.children.get(char), word, index + 1);
    }

    function findNode(node, prefix, index = 0) {
        if (index === prefix.length) return node;
        const char = prefix[index];
        if (!node.children.has(char)) return null;
        return findNode(node.children.get(char), prefix, index + 1);
    }

    function collectWords(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        
        for (const [char, childNode] of node.children) {
            collectWords(childNode, prefix + char, words);
        }
    }

    function remove(node, word, index = 0) {
        if (index === word.length) {
            if (!node.isEndOfWord) return false;
            node.isEndOfWord = false;
            return true;
        }

        const char = word[index];
        if (!node.children.has(char)) return false;

        const childDeleted = remove(node.children.get(char), word, index + 1);
        
        if (!childDeleted) return false;

        const childNode = node.children.get(char);
        if (childNode.children.size === 0 && !childNode.isEndOfWord) {
            node.children.delete(char);
        }

        return true;
    }

    return {
        insertWord: function(word) {
            validateWord(word);
            return insert(root, word.toLowerCase());
        },

        getSuggestions: function(prefix, limit) {
            if (typeof prefix !== 'string' || typeof limit !== 'number' || limit <= 0) {
                throw new Error("Invalid input parameters");
            }

            prefix = prefix.toLowerCase();
            const node = findNode(root, prefix);
            if (!node) return [];

            const suggestions = [];
            collectWords(node, prefix, suggestions);
            return suggestions.sort().slice(0, limit);
        },

        removeWord: function(word) {
            validateWord(word);
            word = word.toLowerCase();
            if (!remove(root, word)) {
                throw new Error("Word does not exist");
            }
        }
    };
}

module.exports = { autoCompleteWords };