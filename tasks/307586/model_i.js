function executeTasksInParallel(tasks) {
    const results = {
        completed: [],
        failed: []
    };

    return Promise.all(tasks.map(async (task, index) => {
        try {
            const result = await task();
            results.completed.push({ status: 'completed', result });
        } catch (error) {
            results.failed.push({ status: 'failed', result: error.message });
        }
    })).then(() => {
        return results;
    });
}

module.exports = {
    executeTasksInParallel
};