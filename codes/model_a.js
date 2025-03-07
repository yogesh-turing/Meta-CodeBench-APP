function createAutocompleteManager(entries) {
  if (!Array.isArray(entries)) {
    throw new Error("Entries must be an array");
  }

  let data = entries.filter(entry => typeof entry === 'string');

  function isValidString(str) {
    return typeof str === 'string' && str.trim().length > 0;
  }

  function hasWordStartingWith(entry, prefix) {
    if (!isValidString(entry) || !isValidString(prefix)) {
      return false;
    }
    
    const words = entry.toLowerCase().split(/\s+/);
    const searchTerm = prefix.toLowerCase();
    
    return words.some(word => word.startsWith(searchTerm));
  }

  return {
    search(prefix) {
      if (!isValidString(prefix)) {
        return [];
      }

      const results = new Set();
      
      for (const entry of data) {
        if (hasWordStartingWith(entry, prefix)) {
          results.add(entry);
          if (results.size >= 5) {
            break;
          }
        }
      }

      return Array.from(results);
    },

    addEntry(item) {
      if (!isValidString(item)) {
        throw new Error("Entry must be a non-empty string");
      }

      if (!data.includes(item)) {
        data.push(item);
      }
    },

    removeEntry(item) {
      if (!isValidString(item)) {
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