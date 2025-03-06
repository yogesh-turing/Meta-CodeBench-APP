function createDatasetManager(dataset) {
  const filters = [];
  let sortConfig = null;
  let groupConfig = null;
  let limitConfig = null;
  const originalData = [...dataset];

  function applyFilters(data) {
    return filters.reduce((filtered, predicate) => 
      filtered.filter(predicate), [...data]);
  }

  function applySorting(data) {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (sortConfig.order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });
  }

  function applyGrouping(data) {
    if (!groupConfig) return data;

    return data.reduce((grouped, item) => {
      const key = item[groupConfig];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
      return grouped;
    }, {});
  }

  function applyLimit(data) {
    if (!limitConfig) return data;

    if (groupConfig && typeof data === 'object') {
      return Object.fromEntries(
        Object.entries(data).map(([key, items]) => [
          key,
          items.slice(0, limitConfig)
        ])
      );
    }

    return data.slice(0, limitConfig);
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
      let result = applyFilters(originalData);
      result = applySorting(result);
      
      if (groupConfig) {
        result = applyGrouping(result);
        result = applyLimit(result);
      } else {
        result = applyLimit(result);
      }

      return result;
    }
  };
}

module.exports = { createDatasetManager };