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

        const dependencies = this.dependencies.get(normalizedTaskId);
        if (!dependencies.includes(normalizedDependencyId)) {
            dependencies.push(normalizedDependencyId);
        }
    }

    scheduleTasksWithDependencies() {
        const visited = new Set();
        const temp = new Set();
        const schedule = [];
        let totalExecutionTime = 0;

        // Group tasks by their group
        const groupedTasks = new Map();
        this.tasks.forEach(task => {
            const group = this.groups.get(task);
            if (!groupedTasks.has(group)) {
                groupedTasks.set(group, []);
            }
            groupedTasks.get(group).push(task);
        });

        const priorityValue = {
            'high': 3,
            'medium': 2,
            'low': 1
        };

        const visit = (task) => {
            if (temp.has(task)) {
                throw new Error('Cyclic dependency detected');
            }
            if (visited.has(task)) {
                return;
            }

            temp.add(task);

            // Visit all dependencies first
            const dependencies = this.dependencies.get(task);
            dependencies.sort((a, b) => {
                const priorityA = priorityValue[this.priorities.get(a)];
                const priorityB = priorityValue[this.priorities.get(b)];
                return priorityB - priorityA;
            });

            for (const dep of dependencies) {
                visit(dep);
            }

            temp.delete(task);
            visited.add(task);
            schedule.push(task);
        };

        // Process tasks group by group, prioritizing within each group
        for (const [group, groupTasks] of groupedTasks) {
            // Sort tasks within group by priority
            groupTasks.sort((a, b) => {
                const priorityA = priorityValue[this.priorities.get(a)];
                const priorityB = priorityValue[this.priorities.get(b)];
                return priorityB - priorityA;
            });

            for (const task of groupTasks) {
                if (!visited.has(task)) {
                    visit(task);
                }
            }
        }

        // Calculate total execution time
        schedule.forEach(task => {
            totalExecutionTime += this.executionTimes.get(task);
        });

        return {
            schedule,
            totalExecutionTime
        };
    }
}

module.exports = {
    TaskSchedulingSystem
};