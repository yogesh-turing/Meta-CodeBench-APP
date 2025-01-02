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
        if (typeof taskId !== 'string' || !taskId) {
            throw new Error('taskId must be a non-empty string');
        }

        // Validate priority
        if (!['high', 'medium', 'low'].includes(priority)) {
            throw new Error('priority must be one of high, medium, or low');
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
        if (typeof taskId !== 'string' || !taskId || typeof dependencyId !== 'string' || !dependencyId) {
            throw new Error('taskId and dependencyId must be non-empty strings');
        }

        // Convert to lowercase
        const normalizedTaskId = taskId.toLowerCase();
        const normalizedDependencyId = dependencyId.toLowerCase();

        if (this.tasks.includes(normalizedTaskId) && this.tasks.includes(normalizedDependencyId)) {
            this.dependencies.get(normalizedTaskId).push(normalizedDependencyId);
        }
    }

    scheduleTasksWithDependencies() {
        // Create a graph from the dependencies
        const graph = new Map();
        for (const task of this.tasks) {
            graph.set(task, this.dependencies.get(task));
        }

        // Perform a topological sort on the graph
        const sortedTasks = this.topologicalSort(graph);

        // Check for cyclic dependencies
        if (sortedTasks === null) {
            throw new Error('Cyclic dependencies detected');
        }

        // Sort tasks with the same dependencies based on priority
        sortedTasks.sort((a, b) => {
            if (this.priorities.get(a) === this.priorities.get(b)) {
                return 0;
            } else if (this.priorities.get(a) === 'high') {
                return -1;
            } else if (this.priorities.get(b) === 'high') {
                return 1;
            } else if (this.priorities.get(a) === 'medium') {
                return -1;
            } else {
                return 1;
            }
        });

        // Group tasks together
        const groupedTasks = {};
        for (const task of sortedTasks) {
            const group = this.groups.get(task);
            if (!groupedTasks[group]) {
                groupedTasks[group] = [];
            }
            groupedTasks[group].push(task);
        }

        // Calculate the total estimated execution time
        let totalExecutionTime = 0;
        for (const task of sortedTasks) {
            totalExecutionTime += this.executionTimes.get(task);
        }

        return { sortedTasks, groupedTasks, totalExecutionTime };
    }

    topologicalSort(graph) {
        const visited = new Set();
        const sortedTasks = [];

        for (const task of graph.keys()) {
            if (!visited.has(task)) {
                if (!this.dfs(graph, task, visited, sortedTasks, new Set())) {
                    return null; // Cyclic dependencies detected
                }
            }
        }

        return sortedTasks;
    }

    dfs(graph, task, visited, sortedTasks, currentPath) {
        if (currentPath.has(task)) {
            return false; // Cyclic dependencies detected
        }

        if (visited.has(task)) {
            return true;
        }

        visited.add(task);
        currentPath.add(task);

        for (const dependency of graph.get(task)) {
            if (!this.dfs(graph, dependency, visited, sortedTasks, currentPath)) {
                return false; // Cyclic dependencies detected
            }
        }

        currentPath.delete(task);
        sortedTasks.push(task);

        return true;
    }
}

module.exports = {
    TaskSchedulingSystem
};