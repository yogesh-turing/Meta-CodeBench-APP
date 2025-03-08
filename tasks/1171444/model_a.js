function createDatasetManager(dataset) {
  const filters = [];
  let sortConfig = null;
  let groupConfig = null;
  let limitConfig = null;
  
  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }
  
  function applySorting(data, key, order) {
    return [...data].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
      return order === 'asc' 
        ? (valueA > valueB ? 1 : valueA < valueB ? -1 : 0)
        : (valueA < valueB ? 1 : valueA > valueB ? -1 : 0);
    });
  }
  
  function applyGrouping(data, key) {
    return data.reduce((grouped, item) => {
      const groupKey = item[key];
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(item);
      return grouped;
    }, {});
  }
  
  function applyLimit(data, limit) {
    if (Array.isArray(data)) {
      return data.slice(0, limit);
    }
    return Object.fromEntries(
      Object.entries(data).map(([key, items]) => [
        key,
        items.slice(0, limit)
      ])
    );
  }

  return {
    filterBy(predicate) {
      filters.push(predicate);
      return this;
    },

    sortBy(key, order = 'asc') {
      sortConfig = { key, order };
      return this;
    },

    groupBy(key) {
      groupConfig = key;
      return this;
    },

    limit(n) {
      limitConfig = n;
      return this;
    },

    execute() {
      let result = clone(dataset);

      if (filters.length > 0) {
        result = result.filter(item => 
          filters.every(predicate => predicate(item))
        );
      }

      if (sortConfig) {
        result = applySorting(result, sortConfig.key, sortConfig.order);
      }

      if (groupConfig) {
        result = applyGrouping(result, groupConfig);
        if (limitConfig) {
          result = applyLimit(result, limitConfig);
        }
      } else {
        if (limitConfig) {
          result = applyLimit(result, limitConfig);
        }
      }

      return result;
    }
  };
}

module.exports = { createDatasetManager };