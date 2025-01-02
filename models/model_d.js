class TaskSchedulingSystem {
    constructor() {
        this.tasks = [];
        this.dependencies = new Map();
        this.priorities = new Map();
        this.executionTimes = new Map();
        this.groups = new Map();
    }

    validateTaskId(taskId) {
        if (typeof taskId !== 'string') {
            throw new Error('TaskId must be a string');
        }
        if (!taskId || taskId.trim().length === 0) {
            throw new Error('TaskId cannot be empty');
        }
        return taskId.toLowerCase();
    }

    validatePriority(priority) {
        const validPriorities = ['low', 'medium', 'high'];
        const normalizedPriority = priority.toLowerCase();
        if (!validPriorities.includes(normalizedPriority)) {
            throw new Error('Priority must be one of: low, medium, high');
        }
        return normalizedPriority;
    }

    validateExecutionTime(executionTime) {
        if (typeof executionTime !== 'number' || executionTime < 0) {
            throw new Error('Execution time must be a positive number');
        }
        return executionTime;
    }

    addTask(taskId, priority = 'medium', executionTime = 0, group = 'default') {
        const normalizedTaskId = this.validateTaskId(taskId);
        const validatedPriority = this.validatePriority(priority);
        const validatedExecutionTime = this.validateExecutionTime(executionTime);

        if (!this.tasks.includes(normalizedTaskId)) {
            this.tasks.push(normalizedTaskId);
            this.dependencies.set(normalizedTaskId, []);
            this.priorities.set(normalizedTaskId, validatedPriority);
            this.executionTimes.set(normalizedTaskId, validatedExecutionTime);
            this.groups.set(normalizedTaskId, group);
        }
    }

    addDependency(taskId, dependencyId) {
        const normalizedTaskId = this.validateTaskId(taskId);
        const normalizedDependencyId = this.validateTaskId(dependencyId);

        if (normalizedTaskId === normalizedDependencyId) {
            throw new Error('A task cannot depend on itself');
        }

        if (this.tasks.includes(normalizedTaskId) && this.tasks.includes(normalizedDependencyId)) {
            const deps = this.dependencies.get(normalizedTaskId);
            if (!deps.includes(normalizedDependencyId)) {
                deps.push(normalizedDependencyId);
            }
        } else {
            throw new Error('Both tasks must exist before adding a dependency');
        }
    }

    scheduleTasksWithDependencies() {
        const visited = new Set();
        const temp = new Set();
        const schedule = [];
        const priorityValues = { high: 3, medium: 2, low: 1 };

        const hasCycle = (task) => {
            if (temp.has(task)) return true;
            if (visited.has(task)) return false;

            temp.add(task);
            const dependencies = this.dependencies.get(task);
            for (const dep of dependencies) {
                if (hasCycle(dep)) return true;
            }
            temp.delete(task);
            return false;
        };

        const visit = (task) => {
            if (visited.has(task)) return;
            if (temp.has(task)) {
                throw new Error('Cyclic dependency detected');
            }

            temp.add(task);
            const dependencies = this.dependencies.get(task);
            for (const dep of dependencies) {
                visit(dep);
            }
            temp.delete(task);
            visited.add(task);
            schedule.push(task);
        };

        // Group tasks by their groups
        const groupedTasks = {};
        this.tasks.forEach(task => {
            const group = this.groups.get(task);
            if (!groupedTasks[group]) {
                groupedTasks[group] = [];
            }
            groupedTasks[group].push(task);
        });

        // Check for cycles first
        for (const task of this.tasks) {
            if (hasCycle(task)) {
                throw new Error('Cyclic dependency detected');
            }
        }

        // Process tasks group by group
        for (const group in groupedTasks) {
            const tasksInGroup = groupedTasks[group];
            // Sort tasks within group by priority
            tasksInGroup.sort((a, b) => {
                const priorityA = priorityValues[this.priorities.get(a)];
                const priorityB = priorityValues[this.priorities.get(b)];
                return priorityB - priorityA;
            });

            for (const task of tasksInGroup) {
                if (!visited.has(task)) {
                    visit(task);
                }
            }
        }

        // Calculate total execution time
        const totalExecutionTime = schedule.reduce((total, task) => {
            return total + this.executionTimes.get(task);
        }, 0);

        return {
            schedule,
            totalExecutionTime
        };
    }
}

module.exports = {
    TaskSchedulingSystem
};