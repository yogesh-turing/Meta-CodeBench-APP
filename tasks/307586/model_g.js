function executeTasksInParallel(tasks) {
  const results = {
      completed: [],
      failed: []
  };

  const promises = tasks.map(async (task, index) => {
      try {
          const result = await task();
          results.completed.push({ index, status: 'completed', result });
      } catch (error) {
          results.failed.push({ index, status: 'failed', result: error.message });
      }
  });

  return Promise.all(promises).then(() => results);
}

module.exports = {
  executeTasksInParallel
};