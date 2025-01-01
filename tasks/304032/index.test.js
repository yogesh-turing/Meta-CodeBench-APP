const { TaskSchedulingSystem } = require('./model_a');
// const { TaskSchedulingSystem } = require(process.env.TARGET_FILE);

// date plus 6 months
let  DATE_PLUS_6_MONTHS, DATE_PLUS_1_MONTH;

describe('TaskSchedulingSystem', () => {
    let system;

    beforeEach(() => {
        system = new TaskSchedulingSystem(3);
        // Mock Date to 20th dec 2024
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2024-12-20'));
        DATE_PLUS_6_MONTHS = new Date(new Date().getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
        DATE_PLUS_1_MONTH = new Date(new Date().getTime() + 1 * 30 * 24 * 60 * 60 * 1000);
    });

    test('TaskSchedulingSystem should throw an error if maxTasks is invalid or not present', () => {
        expect(() => new TaskSchedulingSystem('')).toThrow(Error);
        expect(() => new TaskSchedulingSystem(0)).toThrow(Error);
        expect(() => new TaskSchedulingSystem(-1)).toThrow(Error);
    });

    test('addTask should throw an error if userId is invalid or not present', () => {
        expect(() => system.addTask('', DATE_PLUS_6_MONTHS)).toThrow(Error);
        expect(() => system.addTask(123, DATE_PLUS_6_MONTHS)).toThrow(Error);
        expect(() => system.addTask(null, DATE_PLUS_6_MONTHS)).toThrow(Error);
        expect(() => system.addTask(undefined, DATE_PLUS_6_MONTHS)).toThrow(Error);
    });

    test('addTask should throw an error if dueDate is invalid', () => {
        // dueDate should be in the future
        expect(() => system.addTask('user1', new Date('2022-12-20'))).toThrow(Error);
        // dueDate should be a valid date
        expect(() => system.addTask('user1', '2024-12-20')).toThrow(Error);
        expect(() => system.addTask('user1', 123)).toThrow(Error);
    });

    test('addTask should set due date to 1 month from now if dueDate is not provided', () => {
        const task = system.addTask('user1');
        expect(task.dueAt).toEqual(new Date(DATE_PLUS_1_MONTH));
        system.deleteTask(task.id);

        // Add another task
        const task1 = system.addTask('user1', null);
        expect(task1.dueAt).toEqual(new Date(DATE_PLUS_1_MONTH));
        system.deleteTask(task1.id);

        // Add another task
        const task2 = system.addTask('user1', undefined);
        expect(task2.dueAt).toEqual(new Date(DATE_PLUS_1_MONTH));
        system.deleteTask(task2.id);

        // Add another task
        const task3 = system.addTask('user1', '');
        expect(task3.dueAt).toEqual(new Date(DATE_PLUS_1_MONTH));
        system.deleteTask(task3.id);
    });

    test('addTask should add a task if user has not reached maxTasks', () => {
        const task = system.addTask('user1', DATE_PLUS_6_MONTHS);
        expect(typeof task.id).toBe('number');
        expect(task.id).toBeGreaterThan(0);
        expect(task.user).toBe('user1');
        expect(task.dueAt).toEqual(new Date(DATE_PLUS_6_MONTHS));
        expect(task.status).toBe('open');
    });

    test('addTask should throw an error if user has reached maxTasks', () => {
        system.addTask('user1', DATE_PLUS_6_MONTHS);
        system.addTask('user1', DATE_PLUS_6_MONTHS);
        system.addTask('user1', DATE_PLUS_6_MONTHS);
        expect(() => system.addTask('user1', DATE_PLUS_6_MONTHS)).toThrow(Error);
    });

    test('getUser should return user tasks', () => {
        const task1 = system.addTask('user1', DATE_PLUS_6_MONTHS);
        const task2 = system.addTask('user1', DATE_PLUS_6_MONTHS);
        expect(system.getUser('user1')).toEqual([task1, task2]);
    });

    test('getUser should throw an error if userId is invalid or not present', () => {
        expect(() => system.getUser('')).toThrow(Error);
        expect(() => system.getUser('user2')).toThrow(Error);
    });

    test('getTasks should return all tasks sorted by dueAt in descending order by default', () => {
        const task1 = system.addTask('user1', DATE_PLUS_6_MONTHS);
        const task2 = system.addTask('user2', DATE_PLUS_1_MONTH);
        expect(system.getTasks()).toEqual([task1, task2]);
    });

    test('getTasks should return all tasks sorted by dueAt in ascending order', () => {
        const task1 = system.addTask('user1', DATE_PLUS_6_MONTHS);
        const task2 = system.addTask('user2', DATE_PLUS_1_MONTH);
        expect(system.getTasks({ field: 'dueAt', direction: 'asc' })).toEqual([task2, task1]);
    });

    test('deleteTask should remove the task from the tasks list', () => {
        const task = system.addTask('user1', DATE_PLUS_6_MONTHS);
        expect(system.deleteTask(task.id)).toBe(true);
        expect(system.tasks).toHaveLength(0);
    });

    test('deleteTask should throw an error if taskId is invalid or not present', () => {
        expect(() => system.deleteTask(999)).toThrow(Error);
    });

    test('updateTask should update the task status', () => {
        const task = system.addTask('user1', DATE_PLUS_6_MONTHS);
        const updatedTask = system.updateTask(task.id, { status: 'completed' });
        expect(updatedTask.status).toBe('completed');
    });

    test('updateTask should throw an error if taskId is invalid or not present', () => {
        expect(() => system.updateTask(999, { status: 'completed' })).toThrow(Error);
    });

    test('updateTask should throw an error if status is invalid or not present', () => {
        const task = system.addTask('user1', DATE_PLUS_6_MONTHS);
        expect(() => system.updateTask(task.id, { status: 'invalid_status' })).toThrow(Error);
    });
});