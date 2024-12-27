class TaskSchedulingSystem {
  constructor(maxTasks, taskDuration) {
    this.maxTasks = maxTasks;
    this.taskDuration = taskDuration * 60 * 60 * 1000;
    this.users = {};
  }

  addTask(userId) {
    if (!this.users[userId]) {
      this.users[userId] = { tasks: [] };
    }

    if (this.users[userId].tasks.length >= this.maxTasks) {
      return;
    }

    this.users[userId].tasks.push(Date.now());
  }

  cleanupExpiredTasks() {
    for (let userId in this.users) {
      let currentTime = Date.now();
      this.users[userId].tasks = this.users[userId].tasks.filter(task => currentTime - task < this.taskDuration);
    }
  }

  getTaskCount(userId) {
    if (!this.users[userId]) {
      return 0;
    }
    return this.users[userId].tasks.length;
  }

  resetTasks(userId) {
    if (this.users[userId]) {
      this.users[userId].tasks = [];
    }
  }
}

module.exports = TaskSchedulingSystem;
