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
      const modifier = sortConfig.order === 'desc' ? -1 : 1;
      
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  }

  function applyLimit(data) {
    if (!limitConfig) return data;
    if (Array.isArray(data)) {
      return data.slice(0, limitConfig);
    }
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value.slice(0, limitConfig)
      ])
    );
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