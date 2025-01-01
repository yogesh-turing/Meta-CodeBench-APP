const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
}

class TaskSchedulingSystem {
    tasks = []; // { id: number, user: string, dueAt: date, status: string }
    users = new Map();
  constructor(maxTasks) {
    if (!Number.isInteger(maxTasks) || maxTasks <= 0) {
      throw new Error("maxTasks must be a positive integer");
    }
    this.maxTasks = maxTasks;
  }

  addTask(userId, dueDate) {
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error("Invalid userId");
    }

    if (!this.users.has(userId)) {
        this.users.set(userId, []);
    }

    const activeTasks = this.users.get(userId).filter(task => [TASK_STATUS.OPEN, TASK_STATUS.IN_PROGRESS].includes(task.status));
    if (activeTasks.length >= this.maxTasks) {
        throw new Error(`User ${userId} has reached the maximum number of tasks`);
    }

    const task = {
        id: this.tasks.length + 1,
        user: userId,
        dueAt: dueDate,
        status: TASK_STATUS.OPEN
    };

    this.tasks.push(task);
    this.users.get(userId).push(task);

    return task;
  }

  getUser(userId) {
    if (!this.users.has(userId)) {
        throw new Error(`User ${userId} not found`);
    }
    return this.users.get(userId);
  }

  getTasks(sortObject = {field: "dueAt", direction: "desc"}) {
    if (!['id', 'user', 'dueAt', 'status'].includes(sortObject.field)) {
        throw new Error('Invalid sort field');
    }
    if (!['asc', 'desc'].includes(sortObject.direction)) {
        throw new Error('Invalid sort direction');
    }

    return this.tasks.sort((a, b) => {
        if (sortObject.direction === 'asc') {
            return a[sortObject.field] < b[sortObject.field] ? -1 : 1;
        } else {
            return a[sortObject.field] > b[sortObject.field] ? -1 : 1;
        }
    });
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        throw new Error(`Task ${taskId} not found`);
    }

    const task = this.tasks.splice(taskIndex, 1)[0];
    this.users.get(task.user).splice(this.users.get(task.user).indexOf(task), 1);

    return true;
  }

  updateTask(taskId, params) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        throw new Error(`Task ${taskId} not found`);
    }

    if (params.status && !Object.values(TASK_STATUS).includes(params.status)) {
        throw new Error('Invalid task status');
    }

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...params };
    const userTasks = this.users.get(this.tasks[taskIndex].user);
    const taskIndexInUserTasks = userTasks.findIndex(task => task.id === taskId);
    userTasks[taskIndexInUserTasks] = this.tasks[taskIndex];

    return this.tasks[taskIndex];
  }
}

module.exports = {
    TaskSchedulingSystem
};