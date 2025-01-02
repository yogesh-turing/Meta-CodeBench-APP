class TaskSchedulingSystem {
    constructor() {
        this.tasks = [];
        this.dependencies = new Map();
        this.priorities = new Map();
        this.executionTimes = new Map();
        this.groups = new Map();
    }

    addTask(taskId, priority = 'medium', executionTime = 0, group = 'default') {
        if (typeof taskId !== 'string' || !taskId.trim()) {
            throw new Error('Invalid taskId. It should be a non-empty string.');
        }

        const allowedPriorities = ['high', 'medium', 'low'];
        if (typeof priority !== 'string' || !allowedPriorities.includes(priority.toLowerCase())) {
            throw new Error('Invalid priority. Allowed values are high, medium, low.');
        }

        if (typeof executionTime !== 'number' || executionTime <= 0) {
            throw new Error('Invalid executionTime. It should be a positive number.');
        }

        const normalizedTaskId = taskId.toLowerCase();

        if (!this.tasks.includes(normalizedTaskId)) {
            this.tasks.push(normalizedTaskId);
            this.dependencies.set(normalizedTaskId, []);
            this.priorities.set(normalizedTaskId, priority.toLowerCase());
            this.executionTimes.set(normalizedTaskId, executionTime);
            this.groups.set(normalizedTaskId, group);
        }
    }

    addDependency(taskId, dependencyId) {
        if (typeof taskId !== 'string' || !taskId.trim() || typeof dependencyId !== 'string' || !dependencyId.trim()) {
            throw new Error('Invalid taskId or dependencyId. Both should be non-empty strings.');
        }

        const normalizedTaskId = taskId.toLowerCase();
        const normalizedDependencyId = dependencyId.toLowerCase();

        if (!this.tasks.includes(normalizedDependencyId)) {
            throw new Error(`Dependency ${normalizedDependencyId} does not exist`);
        }

        if (this.tasks.includes(normalizedTaskId) && this.tasks.includes(normalizedDependencyId)) {
            this.dependencies.get(normalizedTaskId).push(normalizedDependencyId);
        }
    }

    scheduleTasksWithDependencies() {
        const visited = new Set();
        const visiting = new Set();
        const result = [];
        const totalExecutionTime = { time: 0 };

        const visit = (task) => {
            if (visited.has(task)) return;
            if (visiting.has(task)) throw new Error('Cyclic dependency detected.');

            visiting.add(task);

            for (const dep of this.dependencies.get(task)) {
                visit(dep);
            }

            visiting.delete(task);
            visited.add(task);
            result.push(task);
            totalExecutionTime.time += this.executionTimes.get(task);
        };

        const tasksByPriority = this.tasks.sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[this.priorities.get(a)] - priorityOrder[this.priorities.get(b)];
        });

        for (const task of tasksByPriority) {
            visit(task);
        }

        return { scheduledTasks: result, totalExecutionTime: totalExecutionTime.time };
    }
}

module.exports = {
    TaskSchedulingSystem
};