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
        // Validate taskId
        if (typeof taskId !== 'string' || !taskId.trim()) {
            throw new Error('taskId must be a non-empty string');
        }

        // Validate priority
        if (!['low', 'medium', 'high'].includes(priority)) {
            throw new Error('priority must be one of "low", "medium", or "high"');
        }

        // Validate executionTime
        if (typeof executionTime !== 'number' || executionTime <= 0) {
            throw new Error('executionTime must be a positive number');
        }

        // Convert to lowercase
        const normalizedTaskId = taskId.toLowerCase();
        
        if (!this.tasks.includes(normalizedTaskId)) {
            this.tasks.push(normalizedTaskId);
            this.dependencies.set(normalizedTaskId, []);
            this.priorities.set(normalizedTaskId, priority);
            this.executionTimes.set(normalizedTaskId, executionTime);
            this.groups.set(normalizedTaskId, group);
        }
    }

    addDependency(taskId, dependencyId) {
        // Validate taskId and dependencyId
        if (typeof taskId !== 'string' || !taskId.trim()) {
            throw new Error('taskId must be a non-empty string');
        }
        if (typeof dependencyId !== 'string' || !dependencyId.trim()) {
            throw new Error('dependencyId must be a non-empty string');
        }

        // Convert to lowercase
        const normalizedTaskId = taskId.toLowerCase();
        const normalizedDependencyId = dependencyId.toLowerCase();

        if (this.tasks.includes(normalizedTaskId) && this.tasks.includes(normalizedDependencyId)) {
            this.dependencies.get(normalizedTaskId).push(normalizedDependencyId);
        }
    }

    scheduleTasksWithDependencies() {
        // Perform topological sort
        const sortedTasks = this.topologicalSort();

        // Check for cyclic dependencies
        if (sortedTasks === null) {
            throw new Error('Cyclic dependencies detected');
        }

        // Sort tasks based on priority and group
        sortedTasks.sort((a, b) => {
            const priorityA = this.priorities.get(a);
            const priorityB = this.priorities.get(b);
            if (priorityA !== priorityB) {
                return this.priorityOrder(priorityA) - this.priorityOrder(priorityB);
            }
            const groupA = this.groups.get(a);
            const groupB = this.groups.get(b);
            if (groupA !== groupB) {
                return groupA.localeCompare(groupB);
            }
            return 0;
        });

        // Calculate total estimated execution time
        const totalExecutionTime = sortedTasks.reduce((acc, task) => acc + this.executionTimes.get(task), 0);

        return { sortedTasks, totalExecutionTime };
    }

    topologicalSort() {
        const visited = new Set();
        const stack = [];
        for (const task of this.tasks) {
            if (!visited.has(task)) {
                if (!this.dfs(task, visited, stack)) {
                    return null; // Cyclic dependencies detected
                }
            }
        }
        return stack;
    }

    dfs(task, visited, stack) {
        visited.add(task);
        for (const dependency of this.dependencies.get(task)) {
            if (!visited.has(dependency)) {
                if (!this.dfs(dependency, visited, stack)) {
                    return false; // Cyclic dependencies detected
                }
            } else if (!stack.includes(dependency)) {
                return false; // Cyclic dependencies detected
            }
        }
        stack.push(task);
        return true;
    }

    priorityOrder(priority) {
        switch (priority) {
            case 'high':
                return 2;
            case 'medium':
                return 1;
            case 'low':
                return 0;
            default:
                throw new Error(`Unknown priority: ${priority}`);
        }
    }
}

module.exports = {
    TaskSchedulingSystem
};