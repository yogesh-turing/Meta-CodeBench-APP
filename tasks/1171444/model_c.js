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
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      if (sortConfig.order === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      }
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    });
  }

  function applyLimit(data) {
    if (!limitConfig) return data;
    return data.slice(0, limitConfig);
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

  function applyLimitToGroups(groupedData) {
    if (!limitConfig) return groupedData;
    
    return Object.entries(groupedData).reduce((result, [key, items]) => {
      result[key] = items.slice(0, limitConfig);
      return result;
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
        result = applyLimitToGroups(result);
      } else {
        result = applyLimit(result);
      }
      
      return result;
    }
  };
}

module.exports = { createDatasetManager };