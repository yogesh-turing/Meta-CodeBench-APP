function executeTasksInParallel(tasks) {
    const results = {
        completed: [],
        failed: []
    };

    const promises = tasks.map(async (task, index) => {
        try {
            const result = await task();
            results.completed.push({ task: `Task ${index + 1}`, status: 'completed', result });
        } catch (error) {
            results.failed.push({ task: `Task ${index + 1}`, status: 'failed', result: error.message });
        }
    });

    return Promise.all(promises).then(() => results);
}

module.exports = {
    executeTasksInParallel
};