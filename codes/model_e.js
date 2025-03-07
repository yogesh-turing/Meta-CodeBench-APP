function createAutocompleteManager(entries) {
  if (!Array.isArray(entries)) {
    throw new Error("Entries must be an array");
  }

  let data = entries.filter(entry => typeof entry === 'string');

  function isWordMatch(entry, searchTerm) {
    if (typeof entry !== 'string' || typeof searchTerm !== 'string') {
      return false;
    }
    
    const words = entry.toLowerCase().split(/\s+/);
    const term = searchTerm.toLowerCase();
    
    return words.some(word => word.startsWith(term));
  }

  return {
    search(prefix) {
      if (typeof prefix !== 'string') {
        return [];
      }

      if (prefix.trim() === '') {
        return data.slice(0, 5);
      }

      const uniqueResults = new Set();
      const matches = data.filter(entry => {
        if (isWordMatch(entry, prefix) && !uniqueResults.has(entry)) {
          uniqueResults.add(entry);
          return true;
        }
        return false;
      });

      return matches.slice(0, 5);
    },

    addEntry(item) {
      if (typeof item !== 'string' || item.trim() === '') {
        throw new Error("Entry must be a non-empty string");
      }

      if (!data.includes(item)) {
        data.push(item);
      }
    },

    removeEntry(item) {
      if (typeof item !== 'string') {
        return;
      }

      const idx = data.indexOf(item);
      if (idx !== -1) {
        data.splice(idx, 1);
      }
    }
  };
}

module.exports = { createAutocompleteManager };