const { executeTasksInParallel } = require('./correct')

describe('executeTasksInParallel', () => {
    test('should execute all successful tasks in parallel', async () => {
        const tasks = [
            () => Promise.resolve('task 1'),
            () => Promise.resolve('task 2'),
            () => Promise.resolve('task 3'),
        ];

        const result = await executeTasksInParallel(tasks);

        expect(result.completed).toHaveLength(3);
        expect(result.failed).toHaveLength(0);
    });

    test('should handle failed tasks', async () => {
        const tasks = [
            () => Promise.reject(new Error('error 1')),
            () => Promise.reject(new Error('error 2')),
        ];

        const result = await executeTasksInParallel(tasks);

        expect(result.completed).toHaveLength(0);
        expect(result.failed).toHaveLength(2);
        expect(result.failed[0].status).toEqual('failed');
    });

    test('should handle mix of successful and failed tasks', async () => {
        const tasks = [
            () => Promise.resolve('success'),
            () => Promise.reject(new Error('failure')),
            () => Promise.resolve('another success'),
        ];

        const result = await executeTasksInParallel(tasks);

        expect(result.completed).toHaveLength(2);
        expect(result.failed).toHaveLength(1);

    });

    test('should handle empty tasks array', async () => {
        const tasks = [];

        const result = await executeTasksInParallel(tasks);

        expect(result.completed).toHaveLength(0);
        expect(result.failed).toHaveLength(0);
    });
});
