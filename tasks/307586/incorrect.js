function executeTasksInParallel(tasks) {
    const results = {
        completed: [],
        failed: []
    };

    tasks.forEach(async (task, i) => {
        try {
            const result = await task();
            results.completed.push({
                task: `Task ${i}`,
                status: 'completed',
                result
            });
        } catch (error) {
            results.failed.push({
                task: `Task ${i}`,
                status: 'failed',
                result: error.message
            });
        }
    });

    return results;
}

module.exports = {
    executeTasksInParallel
};