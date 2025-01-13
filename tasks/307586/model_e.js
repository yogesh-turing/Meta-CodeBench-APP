async function executeTasksInParallel(tasks) {
    const taskPromises = tasks.map(async (task, index) => {
        try {
            const result = await task();
            return { status: 'completed', result, index };
        } catch (error) {
            return { status: 'failed', error: error.message, index };
        }
    });

    const results = await Promise.all(taskPromises);

    const categorizedResults = results.reduce((acc, task) => {
        acc[task.status].push({
            index: task.index,
            [task.status === 'completed' ? 'result' : 'error']: task[task.status === 'completed' ? 'result' : 'error']
        });
        return acc;
    }, { completed: [], failed: [] });

    return categorizedResults;
}

module.exports = {
    executeTasksInParallel
};