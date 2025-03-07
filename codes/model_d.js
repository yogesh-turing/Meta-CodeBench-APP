function createAutocompleteManager(entries) {
  if (!Array.isArray(entries)) {
    throw new Error('Entries must be an array');
  }

  // Initialize with validated entries
  let data = entries.filter(entry => typeof entry === 'string')
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0);

  // Remove duplicates
  data = [...new Set(data)];

  return {
    search(prefix) {
      // Handle invalid prefix
      if (typeof prefix !== 'string') {
        return [];
      }

      const lower = prefix.toLowerCase().trim();
      if (!lower) {
        return data.slice(0, 5);
      }

      return data.filter(entry => {
        // Split entry into words and check if any word starts with the prefix
        const words = entry.toLowerCase().split(/\s+/);
        return words.some(word => word.startsWith(lower));
      }).slice(0, 5);
    },

    addEntry(item) {
      // Validate new entry
      if (typeof item !== 'string' || item.trim().length === 0) {
        throw new Error('Entry must be a non-empty string');
      }

      const trimmedItem = item.trim();
      
      // Prevent duplicates
      if (!data.includes(trimmedItem)) {
        data.push(trimmedItem);
      }
    },

    removeEntry(item) {
      if (typeof item !== 'string') {
        return;
      }

      const idx = data.indexOf(item.trim());
      if (idx !== -1) {
        data.splice(idx, 1);
      }
    }
  };
}

module.exports = { createAutocompleteManager };