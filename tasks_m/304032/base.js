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
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error("Invalid userId");
    }

    const currentTime = Date.now();
    const user = this.getUser(userId);
    this.cleanupExpiredTasks(userId);

    if (user.tasks.length >= this.maxTasks) {
      throw new Error("User has reached the task limit");
    }

    user.tasks.push({ timestamp: currentTime });
    console.log(`Task added for user: ${userId}`);
  }

  cleanupExpiredTasks(userId) {
    const user = this.getUser(userId);
    const currentTime = Date.now();
    user.tasks = user.tasks.filter(task => currentTime - task.timestamp < this.taskDuration);
  }

  getUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, { tasks: [] });
    }
    return this.users.get(userId);
  }

  getTaskCount(userId) {
    const user = this.getUser(userId);
    this.cleanupExpiredTasks(userId);
    return user.tasks.length;
  }

  resetTasks(userId) {
    if (this.users.has(userId)) {
      this.users.get(userId).tasks = [];
      console.log(`All tasks removed for user: ${userId}`);
    }
  }
}

// const taskScheduler = new TaskSchedulingSystem(3, 1);

// try {
//   taskScheduler.addTask("user1");
//   taskScheduler.addTask("user1");
//   taskScheduler.addTask("user1");
//   taskScheduler.addTask("user1");
// } catch (e) {
//   console.log(e.message);
// }

// console.log(taskScheduler.getTaskCount("user1"));

// setTimeout(() => {
//   taskScheduler.addTask("user1");
//   console.log(taskScheduler.getTaskCount("user1"));
// }, 60 * 60 * 1000);


module.exports = TaskSchedulingSystem;