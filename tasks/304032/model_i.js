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
            throw new Error('taskId must be a non-empty string');
        }
        if (!['high', 'medium', 'low'].includes(priority)) {
            throw new Error('priority must be one of high, medium, or low');
        }
        if (typeof executionTime !== 'number' || executionTime <= 0) {
            throw new Error('executionTime must be a positive number');
        }

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
        const graph = {};
        const inDegree = {};
        const priorityMap = { high: 2, medium: 1, low: 0 };

        this.tasks.forEach(task => {
            graph[task] = [];
            inDegree[task] = 0;
        });

        this.tasks.forEach(task => {
            const dependencies = this.dependencies.get(task);
            dependencies.forEach(dependency => {
                graph[dependency].push(task);
                inDegree[task]++;
            });
        });

        const queue = [];
        this.tasks.forEach(task => {
            if (inDegree[task] === 0) {
                queue.push(task);
            }
        });

        const sortedTasks = [];
        const visited = new Set();
        let totalExecutionTime = 0;

        while (queue.length > 0) {
            const task = queue.shift();
            if (visited.has(task)) {
                continue;
            }
            visited.add(task);

            const group = this.groups.get(task);
            const tasksInGroup = this.tasks.filter(t => this.groups.get(t) === group);
            tasksInGroup.forEach(t => {
                if (!visited.has(t)) {
                    queue.push(t);
                }
            });

            sortedTasks.push(task);
            totalExecutionTime += this.executionTimes.get(task);

            graph[task].forEach(neighbor => {
                inDegree[neighbor]--;
                if (inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            });
        }

        if (sortedTasks.length !== this.tasks.length) {
            throw new Error('Cyclic dependencies detected');
        }

        sortedTasks.sort((a, b) => {
            if (this.groups.get(a) === this.groups.get(b)) {
                return priorityMap[this.priorities.get(b)] - priorityMap[this.priorities.get(a)];
            }
            return 0;
        });

        return { sortedTasks, totalExecutionTime };
    }
}

module.exports = {
    TaskSchedulingSystem
};