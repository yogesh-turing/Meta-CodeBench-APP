function createDatasetManager(dataset) {
  // Keep the original dataset intact; we'll copy it when executing.
  const originalData = Array.isArray(dataset) ? [...dataset] : [];

  // We'll store each operation in a "pipeline" so we can apply them in the order they were called.
  const operations = [];

  return {
    filterBy(predicate) {
      // Instead of keeping just one filter, push all filters into the pipeline
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
      operations.push({ type: 'limit', count: n });
      return this;
    },

    execute() {
      // Start with a fresh copy of the data so we don’t mutate the original.
      let finalData = [...originalData];

      // Apply each operation in the order it was called.
      for (const op of operations) {
        switch (op.type) {
          case 'filter':
            // If we've not yet grouped (i.e., finalData is an array), filter that array.
            // If we've already grouped (i.e., finalData is an object), filter each group separately.
            if (Array.isArray(finalData)) {
              finalData = finalData.filter(op.predicate);
            } else {
              // finalData is an object of grouped arrays
              for (const key of Object.keys(finalData)) {
                finalData[key] = finalData[key].filter(op.predicate);
              }
            }
            break;

          case 'sort':
            // Similarly, if finalData is an array, sort it. If already grouped, sort each group array.
            if (Array.isArray(finalData)) {
              finalData.sort((a, b) => {
                if (a[op.key] < b[op.key]) return op.order === 'asc' ? -1 : 1;
                if (a[op.key] > b[op.key]) return op.order === 'asc' ? 1 : -1;
                return 0;
              });
            } else {
              for (const groupName of Object.keys(finalData)) {
                finalData[groupName].sort((a, b) => {
                  if (a[op.key] < b[op.key]) return op.order === 'asc' ? -1 : 1;
                  if (a[op.key] > b[op.key]) return op.order === 'asc' ? 1 : -1;
                  return 0;
                });
              }
            }
            break;

          case 'limit':
            // If still an array, limit the entire dataset. If grouped, limit each group.
            if (Array.isArray(finalData)) {
              finalData = finalData.slice(0, op.count);
            } else {
              for (const groupName of Object.keys(finalData)) {
                finalData[groupName] = finalData[groupName].slice(0, op.count);
              }
            }
            break;

          case 'group':
            // Convert the array (or sub-arrays if we've already grouped) into an object of arrays keyed by op.key.
            if (Array.isArray(finalData)) {
              const grouped = {};
              for (const item of finalData) {
                const groupValue = item[op.key];
                if (!grouped[groupValue]) {
                  grouped[groupValue] = [];
                }
                grouped[groupValue].push(item);
              }
              finalData = grouped;
            } else {
              // If already grouped, regroup each subgroup by op.key (less common, but we’ll handle it).
              const newGrouped = {};
              for (const groupName of Object.keys(finalData)) {
                for (const item of finalData[groupName]) {
                  const groupValue = item[op.key];
                  if (!newGrouped[groupValue]) {
                    newGrouped[groupValue] = [];
                  }
                  newGrouped[groupValue].push(item);
                }
              }
              finalData = newGrouped;
            }
            break;
        }
      }

      return finalData;
    }
  };
}

module.exports = { createDatasetManager };