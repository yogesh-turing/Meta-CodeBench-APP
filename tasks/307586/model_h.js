function executeTasksInParallel(tasks) {
    const results = {
        completed: [],
        failed: [],
    };

    const promises = tasks.map((task, index) => {
        return task()
            .then((result) => {
                results.completed.push({ task: index, status: 'completed', result });
            })
            .catch((error) => {
                results.failed.push({ task: index, status: 'failed', result: error.message });
            });
    });

    return Promise.all(promises).then(() => {
        return results;
    });
}

module.exports = {
    executeTasksInParallel
};