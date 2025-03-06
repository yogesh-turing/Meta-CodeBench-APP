function createDatasetManager(dataset) {
  const filters = [];
  let data = [...dataset];
  let sortConfig = null;
  let groupConfig = null;
  let limitConfig = null;

  function applyFilters(items) {
    return filters.reduce((filtered, predicate) => 
      filtered.filter(predicate), [...items]);
  }

  function applySorting(items) {
    if (!sortConfig) return items;
    
    const { key, order } = sortConfig;
    return [...items].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
      return order === 'asc' 
        ? (valueA < valueB ? -1 : valueA > valueB ? 1 : 0)
        : (valueA > valueB ? -1 : valueA < valueB ? 1 : 0);
    });
  }

  function applyLimit(items) {
    if (!limitConfig) return items;
    return items.slice(0, limitConfig);
  }

  function applyGrouping(items) {
    if (!groupConfig) return items;

    return items.reduce((groups, item) => {
      const key = item[groupConfig];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
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
      let result = applyFilters(data);
      result = applySorting(result);
      
      if (groupConfig) {
        const grouped = applyGrouping(result);
        if (limitConfig) {
          for (const key in grouped) {
            grouped[key] = applyLimit(grouped[key]);
          }
        }
        return grouped;
      }

      if (limitConfig) {
        result = applyLimit(result);
      }
      
      return result;
    }
  };
}

module.exports = { createDatasetManager };