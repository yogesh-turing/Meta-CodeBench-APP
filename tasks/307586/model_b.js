async function executeTasksInParallel(tasks) {
    const taskPromises = tasks.map(async (task, index) => {
        try {
            const result = await task();
            return { status: 'completed', result, index };
        } catch (error) {
            return { status: 'failed', error: error.message, index };
        }
    });

    const results = await Promise.allSettled(taskPromises);

    return results.reduce((acc, result, index) => {
        if (result.status === 'fulfilled') {
            const taskResult = result.value;
            acc[taskResult.status].push({
                index: taskResult.index,
                ...taskResult
            });
        } else {
            acc.failed.push({
                index,
                status: 'failed',
                error: result.reason
            });
        }
        return acc;
    }, { completed: [], failed: [] });
}

module.exports = {
    executeTasksInParallel
};