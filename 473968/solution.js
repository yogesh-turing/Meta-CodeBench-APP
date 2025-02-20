function autoCompleteWords() {
  const root = {};

  return {
    insertWord: function (word) {
      if (!word) return;
      word = word.toLowerCase();
      let node = root;

      for (const char of word) {
        if (!node[char]) {
          node[char] = {};
        }
        node = node[char];
      }
      node.isEndOfWord = true;
    },

    getSuggestions: function (prefix, limit) {
      prefix = prefix.toLowerCase();
      let node = root;

      for (const char of prefix) {
        if (!node[char]) return [];
        node = node[char];
      }

      const results = [];
      function dfs(currentNode, currentWord) {
        if (results.length >= limit) return;
        if (currentNode.isEndOfWord) results.push(currentWord);

        for (const char of Object.keys(currentNode).sort()) {
          dfs(currentNode[char], currentWord + char);
        }
      }

      dfs(node, prefix);
      return results;
    },

    removeWord: function (word) {
      word = word.toLowerCase();
      let node = root;
      const stack = [];

      for (const char of word) {
        if (!node[char]) throw new Error("Word does not exist");
        stack.push([node, char]);
        node = node[char];
      }

      if (!node.isEndOfWord) throw new Error("Word does not exist");
      node.isEndOfWord = false;

      for (let i = stack.length - 1; i >= 0; i--) {
        const [parent, char] = stack[i];
        if (
          Object.keys(parent[char]).length === 1 &&
          !parent[char].isEndOfWord
        ) {
          delete parent[char];
        } else {
          break;
        }
      }
    },
  };
}

module.exports = { autoCompleteWords };