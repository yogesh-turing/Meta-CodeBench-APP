class TaskSchedulingSystem {
  constructor(maxTasks, taskDuration) {
    if (!Number.isInteger(maxTasks) || maxTasks <= 0) {
      throw new Error("maxTasks must be a positive integer");
    }
    if (!Number.isInteger(taskDuration) || taskDuration <= 0) {
      throw new Error("taskDuration must be a positive integer");
    }
    this.maxTasks = maxTasks;
    this.taskDuration = taskDuration * 60 * 60 * 1000;
    this.users = new Map();
  }

  addTask(userId) {
    this.validateUserId(userId);
    const currentTime = Date.now();
    const user = this.getUser(userId);

    this.cleanupExpiredTasks(user);

    if (user.tasks.size >= this.maxTasks) {
      throw new Error(
        `User ${userId} has reached the task limit of ${this.maxTasks}`
      );
    }

    const expirationTime = currentTime + this.taskDuration;
    const task = { timestamp: currentTime, expirationTime };
    user.tasks.add(task);

    setTimeout(() => {
      this.cleanupExpiredTasks(user);
    }, this.taskDuration);

    console.log(`Task added for user: ${userId}`);
  }

  cleanupExpiredTasks(user) {
    const currentTime = Date.now();
    const expiredTasks = [];
    user.tasks.forEach((task) => {
      if (currentTime - task.timestamp >= this.taskDuration) {
        expiredTasks.push(task);
      }
    });

    expiredTasks.forEach((task) => {
      user.tasks.delete(task);
    });
  }

  getUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, { tasks: new Set() });
    }
    return this.users.get(userId);
  }

  getTaskCount(userId) {
    this.validateUserId(userId);
    const user = this.getUser(userId);

    this.cleanupExpiredTasks(user);

    return user.tasks.size;
  }

  resetTasks(userId) {
    this.validateUserId(userId);
    if (this.users.has(userId)) {
      this.users.get(userId).tasks.clear();
      console.log(`All tasks removed for user: ${userId}`);
    }
  }

  getActiveTasks(userId) {
    this.validateUserId(userId);
    const user = this.getUser(userId);
    
    this.cleanupExpiredTasks(user);

    return Array.from(user.tasks).map((task) => ({
      timestamp: task.timestamp,
      expirationTime: task.expirationTime,
    }));
  }

  validateUserId(userId) {
    if (typeof userId !== "string" || userId.trim() === "") {
      throw new Error("Invalid userId");
    }
  }
}

module.exports = TaskSchedulingSystem;
