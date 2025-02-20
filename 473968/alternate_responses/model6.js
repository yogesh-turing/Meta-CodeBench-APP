function autoCompleteWords() {
    const trie = {};
    const wordSet = new Set();

    function insertWord(word) {
        if (wordSet.has(word)) {
            return;
        }
        wordSet.add(word);
        let node = trie;
        for (let char of word) {
            if (!node[char]) {
                node[char] = {};
            }
            node = node[char];
        }
        node.isEndOfWord = true;
    }

    function getSuggestions(prefix, limit) {
        let node = trie;
        for (let char of prefix) {
            if (!node[char]) {
                return [];
            }
            node = node[char];
        }
        const suggestions = [];
        dfs(node, prefix, suggestions);
        return suggestions.sort().slice(0, limit);
    }

    function dfs(node, prefix, suggestions) {
        if (node.isEndOfWord) {
            suggestions.push(prefix);
        }
        for (let char in node) {
            if (char !== 'isEndOfWord') {
                dfs(node[char], prefix + char, suggestions);
            }
        }
    }

    function removeWord(word) {
        if (!wordSet.has(word)) {
            throw new Error("Word does not exist");
        }
        wordSet.delete(word);
        let node = trie;
        let path = [];
        for (let char of word) {
            path.push(char);
            node = node[char];
        }
        node.isEndOfWord = false;
        for (let i = path.length - 1; i >= 0; i--) {
            if (Object.keys(node).length > 0) {
                break;
            }
            node = trie;
            for (let j = 0; j < i; j++) {
                node = node[path[j]];
            }
            delete node[path[i]];
        }
    }

    return {
        insertWord,
        getSuggestions,
        removeWord
    };
}

module.exports = { autoCompleteWords };