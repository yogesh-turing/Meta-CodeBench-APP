function createDatasetManager(dataset) {
  let data = dataset;
  let filterPredicate = null;

  let sortKey = null;
  let sortOrder = 'asc';

  let groupKey = null;

  return {
    filterBy(predicate) {
      filterPredicate = predicate;
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

    execute() {
      if (filterPredicate) {
        data = data.filter(filterPredicate);
      }
      return data;
    }
  };
}

module.exports = {createDatasetManager}