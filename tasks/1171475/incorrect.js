function createDatasetManager(dataset) {
  // Keep a reference to the original data (we won't mutate it).
  // Instead of immediately changing "dataset", we'll do all transformations
  // at the time of execute() on a fresh copy.
  let originalData = dataset;

  // We’ll collect all filters here so multiple filterBy() calls can work.
  let filterPredicates = [];

  // Store sort configuration
  let sortKey = null;
  let sortOrder = 'asc';

  // Store group key
  let groupKey = null;

  // Store limit
  let limitCount = null;

  return {
    filterBy(predicate) {
      filterPredicates.push(predicate);
      return this; // chainable
    },

    sortBy(key, order = 'asc') {
      sortKey = key;
      sortOrder = order;
      return this; // chainable
    },

    groupBy(key) {
      groupKey = key;
      return this; // chainable
    },

    limit(n) {
      limitCount = n;
      return this; // chainable
    },

    execute() {
      // Work on a copy so we don't mutate the original dataset
      let data = [...originalData];

      // Apply all collected filters in sequence
      for (const predicate of filterPredicates) {
        data = data.filter(predicate);
      }

      // Apply sort if specified
      if (sortKey) {
        data.sort((a, b) => {
          const aVal = a[sortKey];
          const bVal = b[sortKey];
          if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // If grouping is specified, transform data into grouped object
      if (groupKey) {
        const groupedData = {};

        data.forEach(item => {
          const key = item[groupKey];
          if (!groupedData[key]) {
            groupedData[key] = [];
          }
          groupedData[key].push(item);
        });

        // If limit is specified, limit each group to 'limitCount' items.
        if (limitCount !== null) {
          for (const key in groupedData) {
            groupedData[key] = groupedData[key].slice(0, limitCount);
          }
        }

        return groupedData;
      } else {
        // If not grouped, apply limit to the entire array.
        if (limitCount !== null) {
          data = data.slice(0, limitCount);
        }

        return data;
      }
    }
  };
}

module.exports = { createDatasetManager };