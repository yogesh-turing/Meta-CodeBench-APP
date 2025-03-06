function createDatasetManager(dataset) {
  // Keep track of all operations in the order they were called.
  // We'll apply them in sequence within execute().
  const operations = [];

  return {
    filterBy(predicate) {
      operations.push({ type: 'filter', predicate });
      return this;
    },

    sortBy(key, order = 'asc') {
      operations.push({ type: 'sort', key, order });
      return this;
    },

    groupBy(key) {
      operations.push({ type: 'group', key });
      return this;
    },

    limit(n) {
      operations.push({ type: 'limit', n });
      return this;
    },

    execute() {
      // Copy the original dataset so we don't mutate it.
      let result = dataset.slice();

      // Apply each operation in order.
      for (const op of operations) {
        switch (op.type) {
          case 'filter':
            result = result.filter(op.predicate);
            break;

          case 'sort': {
            const { key, order } = op;
            result.sort((a, b) => {
              if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
              if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
              return 0;
            });
            break;
          }

          case 'group': {
            const grouped = {};
            const { key } = op;
            // Build an object of arrays, keyed by the group field
            for (const item of result) {
              const groupValue = item[key];
              if (!grouped[groupValue]) {
                grouped[groupValue] = [];
              }
              grouped[groupValue].push(item);
            }
            result = grouped;
            break;
          }

          case 'limit': {
            const { n } = op;
            if (Array.isArray(result)) {
              // If still an array, just slice at the top level
              result = result.slice(0, n);
            } else {
              // If grouped (object), slice each array
              for (const groupKey in result) {
                if (Array.isArray(result[groupKey])) {
                  result[groupKey] = result[groupKey].slice(0, n);
                }
              }
            }
            break;
          }
        }
      }

      return result;
    }
  };
}

module.exports = { createDatasetManager };