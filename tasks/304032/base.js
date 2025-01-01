const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
}

class TaskSchedulingSystem {
    tasks = []; // { id: number, user: string, dueAt: date, status: string, createdAt: date, updatedAt: date, completedAt: date }
    users = [];
    constructor(maxTasks) {
        if (!Number.isInteger(maxTasks) || maxTasks <= 0) {
            throw new Error("maxTasks must be a positive integer");
        }
        this.maxTasks = maxTasks;
        this.users = new Map();
    }

    addTask(userId, dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
        if (typeof userId !== 'string' || userId.trim() === '') {
            throw new Error("Invalid userId");
        }

        if (new Date(dueDate) <= new Date()) {
            throw new Error("Due date must be in the future");
        }

        const userTasks = this.tasks.filter(task => task.user === userId && (task.status === TASK_STATUS.OPEN || task.status === TASK_STATUS.IN_PROGRESS));
        if (userTasks.length >= this.maxTasks) {
            throw new Error("User has reached the maximum number of tasks");
        }

        const newTask = {
            id: this.tasks.length + 1,
            user: userId,
            dueAt: new Date(dueDate),
            status: TASK_STATUS.OPEN,
            createdAt: new Date(),
            updatedAt: new Date(),
            history: []
        };

        this.tasks.push(newTask);
        if (!this.users.has(userId)) {
            this.users.set(userId, []);
        }
        this.users.get(userId).push(newTask);

        return newTask;
    }

    getUser(userId) {
        if (typeof userId !== 'string' || userId.trim() === '' || !this.users.has(userId)) {
            throw new Error("Invalid or non-existent userId");
        }

        return this.users.get(userId);
    }

    getTasks(sortObject = { field: "dueAt", direction: "desc" }) {
        const sortedTasks = [...this.tasks].sort((a, b) => {
            if (sortObject.direction === "asc") {
                return new Date(a[sortObject.field]) - new Date(b[sortObject.field]);
            } else {
                return new Date(b[sortObject.field]) - new Date(a[sortObject.field]);
            }
        });

        return sortedTasks;
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error("Invalid or non-existent taskId");
        }
        const [deletedTask] = this.tasks.splice(taskIndex, 1);
        const userTasks = this.users.get(deletedTask.user);
        const userTaskIndex = userTasks.findIndex(task => task.id === taskId);
        userTasks.splice(userTaskIndex, 1);

        return true;
    }

    updateTask(taskId, params) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) {
            throw new Error("Invalid or non-existent taskId");
        }

        if (!params.status || !Object.values(TASK_STATUS).includes(params.status)) {
            throw new Error("Invalid or missing status");
        }

        task.status = params.status;
        task.updatedAt = new Date();
        if (params.status === TASK_STATUS.COMPLETED) {
            task.completedAt = new Date();
        }

        return task;
    }

    getTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) {
            throw new Error("Invalid or non-existent taskId");
        }

        const completionTime = task.completedAt ? (new Date(task.completedAt) - new Date(task.createdAt)) / (1000 * 60 * 60 * 24) : null; // in days
        const inProgressTime = task.status === TASK_STATUS.IN_PROGRESS ? (new Date() - new Date(task.updatedAt)) / (1000 * 60 * 60 * 24) : null; // in days

        return {
            ...task,
            completionTime,
            inProgressTime
        };
    }
}

module.exports = {
    TaskSchedulingSystem
};