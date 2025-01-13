async function executeTasksInParallel(tasks) {
    const taskResults = await Promise.all(
        tasks.map(async (task, index) => {
            try {
                const result = await task();
                return { status: 'completed', result, index };
            } catch (error) {
                return { status: 'failed', error: error.message, index };
            }
        })
    );

    const categorizedResults = taskResults.reduce((acc, task) => {
        acc[task.status].push(task);
        return acc;
    }, { completed: [], failed: [] });

    return categorizedResults;
}

module.exports = {
    executeTasksInParallel
};