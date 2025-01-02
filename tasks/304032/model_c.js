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
        if (!taskId || taskId.trim() === '') {
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

        const deps = this.dependencies.get(normalizedTaskId);
        if (!deps.includes(normalizedDependencyId)) {
            deps.push(normalizedDependencyId);
        }
    }

    detectCycle(task, visited, recursionStack) {
        visited.add(task);
        recursionStack.add(task);

        for (const dependency of this.dependencies.get(task)) {
            if (!visited.has(dependency)) {
                if (this.detectCycle(dependency, visited, recursionStack)) {
                    return true;
                }
            } else if (recursionStack.has(dependency)) {
                return true;
            }
        }

        recursionStack.delete(task);
        return false;
    }

    scheduleTasksWithDependencies() {
        const visited = new Set();
        const recursionStack = new Set();
        const result = [];
        let totalExecutionTime = 0;

        // Check for cycles
        for (const task of this.tasks) {
            if (!visited.has(task)) {
                if (this.detectCycle(task, visited, recursionStack)) {
                    throw new Error('Cyclic dependency detected');
                }
            }
        }

        // Group tasks by their dependencies and priorities
        const tasksByGroup = new Map();
        this.tasks.forEach(task => {
            const group = this.groups.get(task);
            if (!tasksByGroup.has(group)) {
                tasksByGroup.set(group, []);
            }
            tasksByGroup.get(group).push(task);
        });

        visited.clear();
        const priorityWeight = { high: 3, medium: 2, low: 1 };

        const processTask = (task) => {
            if (visited.has(task)) return;
            
            // Process dependencies first
            for (const dependency of this.dependencies.get(task)) {
                processTask(dependency);
            }

            if (!visited.has(task)) {
                const group = this.groups.get(task);
                const groupTasks = tasksByGroup.get(group);
                
                // Add all tasks from the same group that are ready to be scheduled
                groupTasks.sort((a, b) => {
                    const priorityA = priorityWeight[this.priorities.get(a)];
                    const priorityB = priorityWeight[this.priorities.get(b)];
                    return priorityB - priorityA;
                });

                for (const groupTask of groupTasks) {
                    if (!visited.has(groupTask) && 
                        this.dependencies.get(groupTask).every(dep => visited.has(dep))) {
                        result.push(groupTask);
                        totalExecutionTime += this.executionTimes.get(groupTask);
                        visited.add(groupTask);
                    }
                }
            }
        };

        // Process all tasks
        this.tasks.forEach(task => {
            if (!visited.has(task)) {
                processTask(task);
            }
        });

        return {
            schedule: result,
            totalExecutionTime: totalExecutionTime
        };
    }
}

module.exports = {
    TaskSchedulingSystem
};