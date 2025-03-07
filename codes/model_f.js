function createAutocompleteManager(entries) {
  let data = entries;

  return {
    search(prefix) {
      // Handle non-string prefix by returning an empty array
      if (typeof prefix !== 'string') {
        return [];
      }

      const lower = prefix.toLowerCase();

      return data.filter(entry => {
        // Split the entry into words and check if any word starts with the prefix
        return entry.toLowerCase().split(' ').some(word => word.startsWith(lower));
      }).slice(0, 5);
    },

    addEntry(item) {
      // Only add if item is a string and not already present
      if (typeof item === 'string' && !data.includes(item)) {
        data.push(item);
      }
    },

    removeEntry(item) {
      const idx = data.indexOf(item);
      // Only splice if the item is found
      if (idx !== -1) {
        data.splice(idx, 1);
      }
    }
  };
}

module.exports = { createAutocompleteManager };