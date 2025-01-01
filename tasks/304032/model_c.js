const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
}

class TaskSchedulingSystem {
    constructor(maxTasks) {
        if (!Number.isInteger(maxTasks) || maxTasks <= 0) {
            throw new Error("maxTasks must be a positive integer");
        }
        this.maxTasks = maxTasks;
        this.tasks = [];
        this.users = new Map();
    }

    addTask(userId, dueDate) {
        if (typeof userId !== 'string' || userId.trim() === '') {
            throw new Error("Invalid userId");
        }

        const userTasks = this.tasks.filter(task => 
            task.user === userId && 
            (task.status === TASK_STATUS.OPEN || task.status === TASK_STATUS.IN_PROGRESS)
        );

        if (userTasks.length >= this.maxTasks) {
            throw new Error(`User has reached maximum task limit of ${this.maxTasks}`);
        }

        const newTask = {
            id: Date.now(),
            user: userId,
            dueAt: new Date(dueDate),
            status: TASK_STATUS.OPEN
        };

        this.tasks.push(newTask);
        
        if (!this.users.has(userId)) {
            this.users.set(userId, []);
        }
        
        return newTask;
    }

    getUser(userId) {
        if (typeof userId !== 'string' || userId.trim() === '') {
            throw new Error("Invalid userId");
        }

        const userTasks = this.tasks.filter(task => task.user === userId);
        if (userTasks.length === 0) {
            throw new Error("User not found");
        }

        return userTasks;
    }

    getTasks(sortObject = {field: "dueAt", direction: "desc"}) {
        return [...this.tasks].sort((a, b) => {
            const aValue = a[sortObject.field];
            const bValue = b[sortObject.field];
            
            if (sortObject.direction === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    delete(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }

        this.tasks.splice(taskIndex, 1);
        return true;
    }

    updateTask(taskId, params) {
        if (!params.status || !Object.values(TASK_STATUS).includes(params.status)) {
            throw new Error("Invalid status");
        }

        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...params
        };

        return this.tasks[taskIndex];
    }
}

module.exports = {
    TaskSchedulingSystem
};