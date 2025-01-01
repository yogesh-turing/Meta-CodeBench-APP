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
        this.users.get(userId).push(newTask);

        return newTask;
    }

    getUser(userId) {
        if (typeof userId !== 'string' || userId.trim() === '') {
            throw new Error("Invalid userId");
        }

        if (!this.users.has(userId)) {
            throw new Error("User not found");
        }

        return this.users.get(userId);
    }

    getTasks(sortObject = { field: "dueAt", direction: "desc" }) {
        const { field, direction } = sortObject;
        
        return [...this.tasks].sort((a, b) => {
            if (direction === "asc") {
                return a[field] < b[field] ? -1 : 1;
            }
            return a[field] > b[field] ? -1 : 1;
        });
    }

    delete(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }

        const task = this.tasks[taskIndex];
        const userTasks = this.users.get(task.user);
        const userTaskIndex = userTasks.findIndex(t => t.id === taskId);

        this.tasks.splice(taskIndex, 1);
        userTasks.splice(userTaskIndex, 1);

        return true;
    }

    updateTask(taskId, params) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        if (params.status && !Object.values(TASK_STATUS).includes(params.status)) {
            throw new Error("Invalid task status");
        }

        Object.assign(task, params);
        
        // Update the task in user's task list as well
        const userTasks = this.users.get(task.user);
        const userTask = userTasks.find(t => t.id === taskId);
        Object.assign(userTask, params);

        return task;
    }
}

module.exports = {
    TaskSchedulingSystem
};