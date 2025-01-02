const { TaskSchedulingSystem } = require('./incorrect');

describe('TaskSchedulingSystem', () => {
    let scheduler;

    beforeEach(() => {
        scheduler = new TaskSchedulingSystem();
    });

    describe('addTask', () => {
        test('should add a valid task', () => {
            scheduler.addTask('A', 'high', 5);
            expect(scheduler.tasks).toContain('a');
            expect(scheduler.priorities.get('a')).toBe('high');
            expect(scheduler.executionTimes.get('a')).toBe(5);
            expect(scheduler.groups.get('a')).toBe('default');
        });

        test('should throw an error for invalid taskId', () => {
            expect(() => scheduler.addTask('', 'high', 5)).toThrow(Error);
            expect(() => scheduler.addTask(null, 'high', 5)).toThrow(Error);
            expect(() => scheduler.addTask(undefined, 'high', 5)).toThrow(Error);
        });

        test('should throw an error for invalid priority', () => {
            expect(() => scheduler.addTask('A', 'urgent', 5)).toThrow(Error);
        });

        test('should throw an error for invalid executionTime', () => {
            expect(() => scheduler.addTask('A', 'high', -1)).toThrow(Error);
            expect(() => scheduler.addTask('A', 'high', 0)).toThrow(Error);
        });

        test('should not add duplicate tasks', () => {
            scheduler.addTask('A', 'high', 5);
            scheduler.addTask('A', 'medium', 10);
            expect(scheduler.tasks.length).toBe(1);
            expect(scheduler.priorities.get('a')).toBe('high');
            expect(scheduler.executionTimes.get('a')).toBe(5);
        });
    });

    describe('addDependency', () => {
        test('should add a dependency between tasks', () => {
            scheduler.addTask('A', 'high', 5);
            scheduler.addTask('B', 'medium', 3);
            scheduler.addDependency('A', 'B');
            expect(scheduler.dependencies.get('a')).toContain('b');
        });

        test('should throw an error for invalid taskId or dependencyId', () => {
            expect(() => scheduler.addDependency('', 'B')).toThrow(Error);
            expect(() => scheduler.addDependency('A', '')).toThrow(Error);
            expect(() => scheduler.addDependency(null, 'B')).toThrow(Error);
            expect(() => scheduler.addDependency('A', null)).toThrow(Error);
        });

        test('should not add a dependency if tasks do not exist', () => {
            scheduler.addTask('A', 'high', 5);
            expect(() => scheduler.addDependency('A', 'B')).toThrow(Error);
            expect(scheduler.dependencies.get('a')).not.toContain('b');
        });
    });

    describe('scheduleTasksWithDependencies', () => {
        test('should schedule tasks with no dependencies', () => {
            scheduler.addTask('A', 'high', 5);
            scheduler.addTask('B', 'medium', 3);
            const result = scheduler.scheduleTasksWithDependencies();
            expect(result.scheduledTasks).toEqual(['a', 'b']);
            expect(result.totalExecutionTime).toBe(8);
        });

        test('should schedule tasks with dependencies in correct order', () => {
            scheduler.addTask('A', 'high', 5);
            scheduler.addTask('B', 'medium', 3);
            scheduler.addTask('C', 'low', 2);
            scheduler.addDependency('B', 'A');
            scheduler.addDependency('C', 'B');
            const result = scheduler.scheduleTasksWithDependencies();
            expect(result.scheduledTasks).toEqual(['a', 'b', 'c']);
            expect(result.totalExecutionTime).toBe(10);
        });

        test('should detect cyclic dependencies and throw an error', () => {
            scheduler.addTask('A', 'high', 5);
            scheduler.addTask('B', 'medium', 3);
            scheduler.addDependency('A', 'B');
            scheduler.addDependency('B', 'A');
            expect(() => scheduler.scheduleTasksWithDependencies()).toThrow(Error);
        });

        test('should handle large sets of tasks and dependencies efficiently', () => {
            for (let i = 0; i < 100; i++) {
                scheduler.addTask(`task${i}`, 'medium', 1);
            }
            for (let i = 1; i < 100; i++) {
                scheduler.addDependency(`task${i}`, `task${i - 1}`);
            }
            const result = scheduler.scheduleTasksWithDependencies();
            expect(result.scheduledTasks.length).toBe(100);
            expect(result.scheduledTasks[0]).toBe('task0');
            expect(result.scheduledTasks[99]).toBe('task99');
            expect(result.totalExecutionTime).toBe(100);
        });

        // It should ensure tasks with higher priority should be scheduled before tasks with lower priority, 
        // even if they have the same dependencies.
        test('should schedule tasks based on priority', () => {
            scheduler.addTask('A', 'low', 5);
            scheduler.addTask('B', 'high', 3);
            scheduler.addTask('C', 'low', 2);
            scheduler.addTask('D', 'medium', 1);
            scheduler.addDependency('B', 'A');
            scheduler.addDependency('C', 'A');
            scheduler.addDependency('D', 'A');
            const result = scheduler.scheduleTasksWithDependencies();
            expect(result.scheduledTasks).toEqual(['a', 'b', 'd', 'c']);
            expect(result.totalExecutionTime).toBe(11);
        });

        // It should ensure that tasks within the same group are scheduled together.
        test('should schedule tasks based on group', () => {
            scheduler.addTask('A', 'high', 5, 'group1');
            scheduler.addTask('B', 'medium', 3, 'group2');
            scheduler.addTask('C', 'low', 2, 'group1');
            scheduler.addTask('D', 'medium', 1, 'group2');
            scheduler.addDependency('B', 'A');
            scheduler.addDependency('C', 'A');
            scheduler.addDependency('D', 'A');
            const result = scheduler.scheduleTasksWithDependencies();
            expect(result.scheduledTasks).toEqual(['a', 'b', 'd', 'c']);
            expect(result.totalExecutionTime).toBe(11);
        });
    });
});