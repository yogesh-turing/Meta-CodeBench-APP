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
            throw new Error("Invalid word input");
        }
    }

    function findNode(word) {
        let current = root;
        for (let char of word) {
            if (!current.children.has(char)) {
                return null;
            }
            current = current.children.get(char);
        }
        return current;
    }

    function collectWords(node, prefix, limit) {
        const words = [];
        
        function dfs(currentNode, currentWord) {
            if (words.length >= limit) return;
            
            if (currentNode.isEndOfWord) {
                words.push(currentWord);
            }
            
            // Get all children characters and sort them for lexicographical order
            const chars = Array.from(currentNode.children.keys()).sort();
            
            for (const char of chars) {
                dfs(currentNode.children.get(char), currentWord + char);
            }
        }
        
        dfs(node, prefix);
        return words;
    }

    return {
        insertWord: function(word) {
            validateWord(word);
            
            let current = root;
            for (let char of word) {
                if (!current.children.has(char)) {
                    current.children.set(char, new TrieNode());
                }
                current = current.children.get(char);
            }
            current.isEndOfWord = true;
        },

        getSuggestions: function(prefix, limit) {
            if (typeof prefix !== 'string' || prefix.length === 0) {
                return [];
            }
            if (!Number.isInteger(limit) || limit <= 0) {
                throw new Error("Invalid limit value");
            }

            const node = findNode(prefix);
            if (!node) return [];

            return collectWords(node, prefix, limit);
        },

        removeWord: function(word) {
            validateWord(word);
            
            function removeHelper(node, word, depth = 0) {
                if (depth === word.length) {
                    if (!node.isEndOfWord) {
                        throw new Error("Word does not exist");
                    }
                    node.isEndOfWord = false;
                    return node.children.size === 0;
                }

                const char = word[depth];
                if (!node.children.has(char)) {
                    throw new Error("Word does not exist");
                }

                const shouldDeleteChild = removeHelper(node.children.get(char), word, depth + 1);

                if (shouldDeleteChild) {
                    node.children.delete(char);
                    return node.children.size === 0 && !node.isEndOfWord;
                }

                return false;
            }

            removeHelper(root, word);
        }
    };
}

module.exports = { autoCompleteWords };