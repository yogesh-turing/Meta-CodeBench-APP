function TrieNode() {
    this.children = {};
    this.isEndOfWord = false;
}

function autoCompleteWords() {
    const root = new TrieNode();

    function insertWord(word) {
        let currentNode = root;
        for (let char of word) {
            if (!currentNode.children[char]) {
                currentNode.children[char] = new TrieNode();
            }
            currentNode = currentNode.children[char];
        }
        currentNode.isEndOfWord = true;
    }

    function getSuggestions(prefix, limit) {
        let currentNode = root;
        for (let char of prefix) {
            if (!currentNode.children[char]) {
                return [];
            }
            currentNode = currentNode.children[char];
        }

        const suggestions = [];
        const stack = [{ node: currentNode, prefix: prefix }];

        while (stack.length > 0 && suggestions.length < limit) {
            const { node, prefix: currentPrefix } = stack.pop();
            if (node.isEndOfWord) {
                suggestions.push(currentPrefix);
            }
            for (let char in node.children) {
                stack.push({ node: node.children[char], prefix: currentPrefix + char });
            }
        }

        return suggestions.sort();
    }

    function removeWord(word) {
        function remove(node, word, index) {
            if (index === word.length) {
                if (!node.isEndOfWord) {
                    throw new Error("Word does not exist");
                }
                node.isEndOfWord = false;
                return Object.keys(node.children).length === 0;
            }

            const char = word[index];
            if (!node.children[char]) {
                throw new Error("Word does not exist");
            }

            const shouldDeleteCurrentNode = remove(node.children[char], word, index + 1);
            if (shouldDeleteCurrentNode) {
                delete node.children[char];
                return Object.keys(node.children).length === 0;
            }

            return false;
        }

        remove(root, word, 0);
    }

    return {
        insertWord,
        getSuggestions,
        removeWord
    };
}

module.exports = { autoCompleteWords };