const TASK_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed"
}

class TaskSchedulingSystem {
  tasks = []; // { id: number, user: string, dueAt: date, status: string }
  users = new Map(); // Map<userId, Set<taskId>>
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
      if (this.users.has(userId)) {
          const userTasks = this.users.get(userId);
          const activeTasks = this.tasks.filter(task => userTasks.has(task.id) && (task.status === TASK_STATUS.OPEN || task.status === TASK_STATUS.IN_PROGRESS));
          if (activeTasks.length >= this.maxTasks) {
              throw new Error(`User ${userId} has reached the maximum number of tasks`);
          }
      } else {
          this.users.set(userId, new Set());
      }

      const taskId = this.tasks.length + 1;
      const task = { id: taskId, user: userId, dueAt: dueDate, status: TASK_STATUS.OPEN };
      this.tasks.push(task);
      this.users.get(userId).add(taskId);
      return task;
  }

  getUser(userId) {
      if (!this.users.has(userId)) {
          throw new Error(`User ${userId} not found`);
      }
      return this.tasks.filter(task => task.user === userId);
  }

  getTasks(sortObject = { field: "dueAt", direction: "desc" }) {
      const sortedTasks = [...this.tasks];
      sortedTasks.sort((a, b) => {
          if (sortObject.direction === "asc") {
              return a[sortObject.field] - b[sortObject.field];
          } else {
              return b[sortObject.field] - a[sortObject.field];
          }
      });
      return sortedTasks;
  }

  deleteTask(taskId) {
      const taskIndex = this.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
          throw new Error(`Task ${taskId} not found`);
      }
      this.tasks.splice(taskIndex, 1);
      const userTasks = this.users.get(this.tasks[taskIndex].user);
      userTasks.delete(taskId);
      return true;
  }

  updateTask(taskId, params) {
      const taskIndex = this.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
          throw new Error(`Task ${taskId} not found`);
      }
      if (params.status && !Object.values(TASK_STATUS).includes(params.status)) {
          throw new Error(`Invalid status ${params.status}`);
      }
      Object.assign(this.tasks[taskIndex], params);
      return this.tasks[taskIndex];
  }
}

module.exports = {
  TaskSchedulingSystem
};