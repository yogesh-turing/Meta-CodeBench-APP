function TrieNode() {
    this.children = {};
    this.isEndOfWord = false;
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
            let words = [];
            dfs(node, prefix, words);
            return words.sort().slice(0, limit);
        },
        removeWord: function(word) {
            removeWordHelper(root, word, 0);
        }
    };

    function dfs(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        for (let char in node.children) {
            dfs(node.children[char], prefix + char, words);
        }
    }

    function removeWordHelper(node, word, index) {
        if (index === word.length) {
            if (!node.isEndOfWord) {
                throw new Error("Word does not exist");
            }
            node.isEndOfWord = false;
            return;
        }
        let char = word[index];
        if (!node.children[char]) {
            throw new Error("Word does not exist");
        }
        removeWordHelper(node.children[char], word, index + 1);
        if (!node.children[char].isEndOfWord && Object.keys(node.children[char].children).length === 0) {
            delete node.children[char];
        }
    }
}

module.exports = { autoCompleteWords };