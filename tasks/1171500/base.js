function createAutocompleteManager(entries) {
  let data = entries;

  return {
    search(prefix) {
      const lower = prefix.toLowerCase();

      return data.filter(entry => {
        return entry.toLowerCase().includes(lower);
      }).slice(0, 5);
    },

    addEntry(item) {
      data.push(item);
    },

    removeEntry(item) {
      const idx = data.indexOf(item);
      data.splice(idx, 1);
    }
  };
}
module.exports = { createAutocompleteManager };