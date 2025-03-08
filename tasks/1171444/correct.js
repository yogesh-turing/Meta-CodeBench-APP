function createDatasetManager(dataset) {
  const operations = [];

  return {
    filterBy(predicate) {
      operations.push({ type: "filter", predicate });
      return this;
    },

    sortBy(key, order) {
      operations.push({ type: "sort", key, order });
      return this;
    },

    groupBy(key) {
      operations.push({ type: "group", key });
      return this;
    },

    limit(n) {
      operations.push({ type: "limit", n });
      return this;
    },

    execute() {
      let result = dataset.slice();

      for (const op of operations) {
        switch (op.type) {
          case "filter":
            result = result.filter(op.predicate);
            break;

          case "sort": {
            const { key, order } = op;
            result.sort((a, b) => {
              return (a[key] - b[key]) * (order === "asc" ? 1 : -1);
            });
            break;
          }

          case "group": {
            const grouped = {};
            const { key } = op;
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

          case "limit": {
            const { n } = op;
            if (Array.isArray(result)) {
              result = result.slice(0, n);
            } else {
              for (const groupKey in result) {
                result[groupKey] = result[groupKey].slice(0, n);
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