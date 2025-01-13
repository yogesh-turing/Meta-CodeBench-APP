function executeTasksInParallel(tasks) {
    const results = [];

    tasks.forEach(async (task, index) => {
        try {
            const result = await task();
            results[index] = result; 
        } catch (error) {
            console.error(`Task ${index} failed: ${error.message}`);
        }
    });

    return Promise.resolve(results); 
}

// const tasks = [
//     () => new Promise((resolve) => setTimeout(() => resolve('Task 1 complete'), 1000)),
//     () => new Promise((_, reject) => setTimeout(() => reject(new Error('Task 2 failed')), 500)),
//     () => new Promise((resolve) => setTimeout(() => resolve('Task 3 complete'), 2000)),
// ];

// // Execute tasks
// executeTasksInParallel(tasks)
//     .then((results) => {
//         console.log('All tasks completed:', results);
//     })
//     .catch((error) => {
//         console.error('Error executing tasks:', error);
//     });

module.exports = {
    executeTasksInParallel
};