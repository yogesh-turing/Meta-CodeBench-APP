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

    function collectWords(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        
        for (let [char, childNode] of node.children) {
            collectWords(childNode, prefix + char, words);
        }
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
            if (typeof prefix !== 'string' || typeof limit !== 'number' || limit <= 0) {
                throw new Error("Invalid input parameters");
            }

            const words = [];
            const node = findNode(prefix);

            if (node) {
                collectWords(node, prefix, words);
            }

            return words
                .sort((a, b) => a.localeCompare(b))
                .slice(0, limit);
        },

        removeWord: function(word) {
            validateWord(word);

            let current = root;
            const stack = [];

            // Traverse to the word's end while storing the path
            for (let char of word) {
                if (!current.children.has(char)) {
                    throw new Error("Word does not exist");
                }
                stack.push([current, char]);
                current = current.children.get(char);
            }

            if (!current.isEndOfWord) {
                throw new Error("Word does not exist");
            }

            // Mark as not end of word
            current.isEndOfWord = false;

            // Remove nodes if they don't lead to any other words
            if (current.children.size === 0) {
                while (stack.length > 0 && current.children.size === 0 && !current.isEndOfWord) {
                    const [parent, char] = stack.pop();
                    parent.children.delete(char);
                    current = parent;
                }
            }
        }
    };
}

module.exports = { autoCompleteWords };