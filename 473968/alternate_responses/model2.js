function autoCompleteWords() {
    class TrieNode {
        constructor() {
            this.children = new Map();
            this.isEndOfWord = false;
        }
    }

    const root = new TrieNode();

    function insertWord(word) {
        if (typeof word !== 'string' || word.length === 0) {
            throw new Error("Invalid word");
        }

        let current = root;
        word = word.toLowerCase();

        for (let char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }
        current.isEndOfWord = true;
    }

    function findNode(prefix) {
        let current = root;
        for (let char of prefix.toLowerCase()) {
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

    function getSuggestions(prefix, limit) {
        if (typeof prefix !== 'string' || prefix.length === 0) {
            throw new Error("Invalid prefix");
        }
        if (!Number.isInteger(limit) || limit <= 0) {
            throw new Error("Invalid limit");
        }

        const node = findNode(prefix.toLowerCase());
        if (!node) return [];

        const suggestions = [];
        collectWords(node, prefix.toLowerCase(), suggestions);
        return suggestions.sort().slice(0, limit);
    }

    function removeWord(word) {
        if (typeof word !== 'string' || word.length === 0) {
            throw new Error("Invalid word");
        }

        word = word.toLowerCase();
        const stack = [];
        let current = root;

        // Traverse to the end of the word while storing the path
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

        // Mark the end node as not end of word
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

    return {
        insertWord,
        getSuggestions,
        removeWord
    };
}

module.exports = { autoCompleteWords };