class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

function autoCompleteWords() {
    const root = new TrieNode();

    return {
        insertWord: function(word) {
            let node = root;
            for (let char of word) {
                if (!node.children[char]) {
                    node.children[char] = new TrieNode();
                }
                node = node.children[char];
            }
            node.isEndOfWord = true;
        },
        getSuggestions: function(prefix, limit) {
            let node = root;
            for (let char of prefix) {
                if (!node.children[char]) {
                    return [];
                }
                node = node.children[char];
            }

            const words = [];
            function dfs(node, prefix) {
                if (node.isEndOfWord) {
                    words.push(prefix);
                }
                for (let char in node.children) {
                    dfs(node.children[char], prefix + char);
                }
            }
            dfs(node, prefix);

            return words.sort().slice(0, limit);
        },
        removeWord: function(word) {
            function remove(node, word, index) {
                if (index === word.length) {
                    if (!node.isEndOfWord) {
                        throw new Error("Word does not exist");
                    }
                    node.isEndOfWord = false;
                    return Object.keys(node.children).length === 0;
                }
                let char = word[index];
                if (!node.children[char]) {
                    throw new Error("Word does not exist");
                }
                let shouldDeleteCurrentNode = remove(node.children[char], word, index + 1);
                if (shouldDeleteCurrentNode) {
                    delete node.children[char];
                    return Object.keys(node.children).length === 0;
                }
                return false;
            }
            remove(root, word, 0);
        }
    };
}

module.exports = { autoCompleteWords };