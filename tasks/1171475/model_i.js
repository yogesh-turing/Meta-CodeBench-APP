function createDatasetManager(dataset) {
  // Keep the original data unmodified
  const originalData = dataset.slice();

  // Collect all filters instead of overwriting
  const filters = [];
  let sortKey = null;
  let sortOrder = 'asc';
  let groupKey = null;
  let limitCount = null;

  return {
    filterBy(predicate) {
      filters.push(predicate);
      return this;
    },

    sortBy(key, order = 'asc') {
      sortKey = key;
      sortOrder = order;
      return this;
    },

    groupBy(key) {
      groupKey = key;
      return this;
    },

    limit(n) {
      limitCount = n;
      return this;
    },

    execute() {
      // Start with a fresh copy so we never mutate the original
      let result = originalData.slice();

      // 1. Apply all filters in sequence
      for (const predicate of filters) {
        result = result.filter(predicate);
      }

      // 2. Sort if a sort key is provided
      if (sortKey) {
        result.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // 3 & 4. If no group key, limit the whole array; if groupKey, group first, then limit each group
      if (!groupKey) {
        // (a) No grouping: Limit the entire result array
        if (limitCount != null) {
          result = result.slice(0, limitCount);
        }
        return result;
      } else {
        // (b) Group the data
        const grouped = {};
        for (const item of result) {
          const keyValue = item[groupKey];
          if (!grouped[keyValue]) {
            grouped[keyValue] = [];
          }
          grouped[keyValue].push(item);
        }

        // If a limit is set, apply it to each group array
        if (limitCount != null) {
          for (const keyValue of Object.keys(grouped)) {
            grouped[keyValue] = grouped[keyValue].slice(0, limitCount);
          }
        }

        return grouped;
      }
    }
  };
}

module.exports = { createDatasetManager };
