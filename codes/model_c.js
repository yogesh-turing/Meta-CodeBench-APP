function createAutocompleteManager(entries) {
  if (!Array.isArray(entries)) {
    throw new Error("Entries must be an array");
  }

  // Validate and filter initial entries
  let data = entries.filter(entry => {
    return typeof entry === 'string' && entry.trim().length > 0;
  });

  // Remove duplicates from initial data
  data = [...new Set(data)];

  function isValidString(str) {
    return typeof str === 'string' && str.trim().length > 0;
  }

  function startsWithIgnoreCase(word, prefix) {
    return word.toLowerCase().startsWith(prefix.toLowerCase());
  }

  return {
    search(prefix) {
      // Handle non-string prefix
      if (!isValidString(prefix)) {
        return [];
      }

      return data
        .filter(entry => {
          // Split entry into words and check if any word starts with prefix
          const words = entry.split(/\s+/);
          return words.some(word => startsWithIgnoreCase(word, prefix));
        })
        .slice(0, 5); // Limit to 5 results
    },

    addEntry(item) {
      // Validate new entry
      if (!isValidString(item)) {
        throw new Error("Entry must be a non-empty string");
      }

      // Check for duplicates
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