function createDatasetManager(dataset) {
  // Keep references to the *configurations* we need:
  const filterPredicates = [];
  let sortKey = null;
  let sortOrder = 'asc';
  let groupKey = null;
  let limitCount = null;

  return {
    filterBy(predicate) {
      // Collect every predicate instead of overwriting
      filterPredicates.push(predicate);
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
      // Work on a copy of the original dataset to avoid mutation
      let result = [...dataset];

      // Apply all collected filters in sequence
      for (const predicate of filterPredicates) {
        result = result.filter(predicate);
      }

      // Apply sorting if a sort key is specified
      if (sortKey) {
        result.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // If no grouping was requested, apply the limit globally and return the array
      if (!groupKey) {
        if (limitCount !== null) {
          result = result.slice(0, limitCount);
        }
        return result;
      }

      // Otherwise, group by the specified key
      const groupedResult = {};
      for (const item of result) {
        const keyValue = item[groupKey];
        // Initialize the group array if it doesn't exist yet
        if (!groupedResult[keyValue]) {
          groupedResult[keyValue] = [];
        }
        // If limitCount is set, enforce that each group's array doesn't exceed this limit
        if (limitCount === null || groupedResult[keyValue].length < limitCount) {
          groupedResult[keyValue].push(item);
        }
      }

      return groupedResult;
    },
  };
}

module.exports = { createDatasetManager };