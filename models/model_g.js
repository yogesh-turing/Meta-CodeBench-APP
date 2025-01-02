class TaskSchedulingSystem {
    constructor() {
        this.tasks = [];
        this.dependencies = new Map();
        this.priorities = new Map();
        this.executionTimes = new Map();
        this.groups = new Map();
    }

    // priority could be low, medium, high
    addTask(taskId, priority = 'medium', executionTime = 0, group = 'default') {
        if (typeof taskId !== 'string' || !taskId.trim()) {
            throw new Error('taskId must be a non-empty string');
        }

        const normalizedTaskId = taskId.toLowerCase();

        if (!this.tasks.includes(normalizedTaskId)) {
            if (!['high', 'medium', 'low'].includes(priority)) {
                throw new Error('priority must be high, medium, or low');
            }

            if (typeof executionTime !== 'number' || executionTime <= 0) {
                throw new Error('executionTime must be a positive number');
            }

            this.tasks.push(normalizedTaskId);
            this.dependencies.set(normalizedTaskId, []);
            this.priorities.set(normalizedTaskId, priority);
            this.executionTimes.set(normalizedTaskId, executionTime);
            this.groups.set(normalizedTaskId, group);
        }
    }

    addDependency(taskId, dependencyId) {
        if (typeof taskId !== 'string' || !taskId.trim() || typeof dependencyId !== 'string' || !dependencyId.trim()) {
            throw new Error('taskId and dependencyId must be non-empty strings');
        }

        const normalizedTaskId = taskId.toLowerCase();
        const normalizedDependencyId = dependencyId.toLowerCase();

        if (this.tasks.includes(normalizedTaskId) && this.tasks.includes(normalizedDependencyId)) {
            this.dependencies.get(normalizedTaskId).push(normalizedDependencyId);
        }
    }

    scheduleTasksWithDependencies() {
        const graph = new Map();
        for (const task of this.tasks) {
            graph.set(task, this.dependencies.get(task));
        }

        const visited = new Set();
        const visiting = new Set();
        const sortedTasks = [];

        for (const task of this.tasks) {
            if (!visited.has(task)) {
                this.topologicalSort(graph, task, visited, visiting, sortedTasks);
            }
        }

        // Prioritize tasks based on priority and group
        sortedTasks.sort((a, b) => {
            if (this.groups.get(a) === this.groups.get(b)) {
                const priorityA = this.priorities.get(a);
                const priorityB = this.priorities.get(b);
                if (priorityA === priorityB) {
                    return 0;
                } else if (priorityA === 'high') {
                    return -1;
                } else if (priorityB === 'high') {
                    return 1;
                } else if (priorityA === 'medium') {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                return this.groups.get(a).localeCompare(this.groups.get(b));
            }
        });

        const totalExecutionTime = sortedTasks.reduce((acc, task) => acc + this.executionTimes.get(task), 0);

        return { sortedTasks, totalExecutionTime };
    }

    topologicalSort(graph, task, visited, visiting, sortedTasks) {
        visiting.add(task);

        for (const dependency of graph.get(task)) {
            if (visiting.has(dependency)) {
                throw new Error('Cyclic dependency detected');
            }

            if (!visited.has(dependency)) {
                this.topologicalSort(graph, dependency, visited, visiting, sortedTasks);
            }
        }

        visiting.delete(task);
        visited.add(task);
        sortedTasks.push(task);
    }
}

module.exports = {
    TaskSchedulingSystem
};