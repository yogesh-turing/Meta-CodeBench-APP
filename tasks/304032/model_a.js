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

        // Calculate active tasks for the user
        const userTasks = this.tasks.filter(task => 
            task.user === userId && 
            (task.status === TASK_STATUS.OPEN || task.status === TASK_STATUS.IN_PROGRESS)
        );

        if (userTasks.length >= this.maxTasks) {
            throw new Error("User has reached maximum task limit");
        }

        // Validate and set due date
        let taskDueDate;
        if (!dueDate) {
            taskDueDate = new Date();
            taskDueDate.setDate(taskDueDate.getDate() + 30);
        } else {
            taskDueDate = new Date(dueDate);
            if (taskDueDate <= new Date()) {
                throw new Error("Due date must be in the future");
            }
        }

        const newTask = {
            id: this.tasks.length + 1,
            user: userId,
            dueAt: taskDueDate,
            status: TASK_STATUS.OPEN
        };

        this.tasks.push(newTask);
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
        const { field, direction } = sortObject;
        
        return [...this.tasks].sort((a, b) => {
            if (direction === "asc") {
                return a[field] > b[field] ? 1 : -1;
            }
            return a[field] < b[field] ? 1 : -1;
        });
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }

        this.tasks.splice(taskIndex, 1);
        return true;
    }

    updateTask(taskId, params) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error("Task not found");
        }

        if (!params.status || !Object.values(TASK_STATUS).includes(params.status)) {
            throw new Error("Invalid task status");
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