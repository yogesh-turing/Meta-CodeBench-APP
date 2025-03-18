const moment = require("moment");
const S = require("sanctuary");

// Helper function to check if a value is a string
const isString = value => S.type(value) === 'String';

class ProjectManagement {
  constructor() {
    this.tasks = {};
    this.milestones = {};
    this.users = {};
  }

  addTaskDependency(taskId, dependencyId) {
    if (!isString(taskId) || !isString(dependencyId)) {
      throw new Error("Invalid data");
    }

    if (!this.tasks[taskId] || !this.tasks[dependencyId]) {
      throw new Error("Task or Dependency not found");
    }

    if (taskId === dependencyId) {
      throw new Error("Task cannot depend on itself");
    }

    if (this.isCircularDependency(taskId, dependencyId)) {
      throw new Error("Circular dependency detected");
    }

    if (!this.tasks[taskId].dependencies) {
      this.tasks[taskId].dependencies = [];
    }
    this.tasks[taskId].dependencies.push(dependencyId);
  }

  isCircularDependency(taskId, dependencyId, visited = new Set()) {
    if (visited.has(dependencyId)) {
      return true;
    }

    visited.add(dependencyId);
    const dependencies = this.tasks[dependencyId]?.dependencies || [];

    for (const dep of dependencies) {
      if (dep === taskId || this.isCircularDependency(taskId, dep, visited)) {
        return true;
      }
    }
    return false;
  }

  createMilestone(milestoneId, title, dueDate) {
    if (!isString(milestoneId) || !isString(title) || !isString(dueDate)) {
      throw new Error("Invalid data");
    }

    if (this.milestones[milestoneId]) {
      throw new Error("Milestone already exists");
    }

    if (!moment(dueDate, "YYYY-MM-DD", true).isValid()) {
      throw new Error("Invalid date format");
    }

    if (moment(dueDate).isBefore(moment(), "day")) {
      throw new Error("Milestone due date cannot be in the past");
    }

    this.milestones[milestoneId] = {
      title,
      dueDate,
      tasks: [],
    };
  }

  trackTime(taskId, startTime, endTime) {
    if (!isString(taskId) || !isString(startTime) || !isString(endTime)) {
      throw new Error("Invalid data");
    }

    if (!this.tasks[taskId]) {
      throw new Error("Task not found");
    }

    if (!moment(startTime, "YYYY-MM-DD HH:mm", true).isValid() || !moment(endTime, "YYYY-MM-DD HH:mm", true).isValid()) {
      throw new Error("Invalid time format");
    }

    const startMoment = moment(startTime);
    const endMoment = moment(endTime);
    const currentMoment = moment();

    if (startMoment.isAfter(currentMoment)) {
      throw new Error("Start time cannot be in future");
    }

    if (startMoment.isAfter(endMoment)) {
      throw new Error("Start time must be before end time");
    }

    const timeSpent = endMoment.diff(startMoment, "minutes");

    if (!this.tasks[taskId].timeEntries) {
      this.tasks[taskId].timeEntries = [];
    }

    this.tasks[taskId].timeEntries.push({
      startTime,
      endTime,
      timeSpent,
    });
  }
}

module.exports = { ProjectManagement };