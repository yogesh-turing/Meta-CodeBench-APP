function createAutocompleteManager(entries) {
  let data = entries;

  return {
    search(prefix) {
      if (typeof prefix !== 'string') {
        return [];
      }

      const lower = prefix.toLowerCase();

      return data.filter(entry => {
        return entry.split(' ').some(word => word.toLowerCase().startsWith(lower));
      }).slice(0, 5);
    },

    addEntry(item) {
      if (typeof item === 'string' && !data.includes(item)) {
        data.push(item);
      }
    },

    removeEntry(item) {
      const idx = data.indexOf(item);
      if (idx !== -1) {
        data.splice(idx, 1);
      }
    }
  };
}

module.exports = { createAutocompleteManager };