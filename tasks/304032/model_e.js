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

        if (!this.tasks.includes(normalizedTaskId)) {
            throw new Error(`Task ${normalizedTaskId} does not exist`);
        }
        if (!this.tasks.includes(normalizedDependencyId)) {
            throw new Error(`Dependency ${normalizedDependencyId} does not exist`);
        }
        if (normalizedTaskId === normalizedDependencyId) {
            throw new Error('Task cannot depend on itself');
        }

        this.dependencies.get(normalizedTaskId).push(normalizedDependencyId);
    }

    scheduleTasksWithDependencies() {
        const visited = new Set();
        const temp = new Set();
        const scheduled = [];
        let totalExecutionTime = 0;

        // Helper function to detect cycles and perform topological sort
        const visit = (taskId) => {
            if (temp.has(taskId)) {
                throw new Error('Cyclic dependency detected');
            }
            if (visited.has(taskId)) {
                return;
            }

            temp.add(taskId);
            const deps = this.dependencies.get(taskId) || [];
            for (const dep of deps) {
                visit(dep);
            }
            temp.delete(taskId);
            visited.add(taskId);
            scheduled.push(taskId);
        };

        // Group tasks by their group
        const tasksByGroup = new Map();
        this.tasks.forEach(task => {
            const group = this.groups.get(task);
            if (!tasksByGroup.has(group)) {
                tasksByGroup.set(group, []);
            }
            tasksByGroup.get(group).push(task);
        });

        // Process each group
        for (const [group, groupTasks] of tasksByGroup) {
            // Sort tasks within group by priority
            groupTasks.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[this.priorities.get(b)] - priorityOrder[this.priorities.get(a)];
            });

            // Process tasks in priority order within group
            for (const task of groupTasks) {
                if (!visited.has(task)) {
                    visit(task);
                }
            }
        }

        // Calculate total execution time
        scheduled.forEach(task => {
            totalExecutionTime += this.executionTimes.get(task);
        });

        return {
            schedule: scheduled,
            totalExecutionTime: totalExecutionTime
        };
    }
}

module.exports = {
    TaskSchedulingSystem
};