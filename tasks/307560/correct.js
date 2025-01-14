const _ = require("lodash");

/**
 * Generates a report of tasks grouped by priority, overdue status, and counts.
 * 
 * This function processes an array of tasks to:
 * 1. Add an `overdue` property to each task based on its deadline.
 * 2. Group the tasks by priority (1 to 5), sorting them by their deadline.
 * 3. Calculate how many tasks are overdue for each priority level.
 * 4. Calculate the total count of tasks for each priority level.
 * 
 * @param {Array<Object>} tasks - The list of tasks to process. Each task should be an object containing:
 *   - `id` {number} - The task's unique identifier.
 *   - `name` {string} - The name or title of the task.
 *   - `priority` {number} - The priority level of the task (1 to 5).
 *   - `deadline` {string} - The task's deadline in ISO date format (e.g., "2024-12-25").
 * 
 * @returns {Object} - An object containing the following properties:
 *   - `groupedTasks` {Object} - The tasks grouped by priority, each priority level containing an array of tasks sorted by their deadline.
 *   - `overdueSummary` {Object} - The number of overdue tasks for each priority level.
 *   - `taskCounts` {Object} - The total count of tasks for each priority level.
 */
function generateTaskReport(tasks) {
  const currentDate = new Date();

  // Fix overdue calculation and add overdue property
  const processedTasks = tasks.map((task) => ({
    ...task,
    overdue: new Date(task.deadline) < currentDate,
  }));

  // Group tasks by priority and sort by deadline
  const groupedTasks = _.chain(processedTasks)
    .groupBy("priority")
    .mapValues((group) => _.orderBy(group, (task) => new Date(task.deadline)))
    .value();

  // Initialize priority levels with empty arrays
  const priorityLevels = _.range(1, 6).reduce((acc, level) => {
    acc[level] = groupedTasks[level] || [];
    return acc;
  }, {});

  // Calculate overdue summary with all priority levels
  const overdueSummary = _.range(1, 6).reduce((acc, level) => {
    acc[level] = _.filter(
      processedTasks,
      (task) => task.priority === level && task.overdue
    ).length;
    return acc;
  }, {});

  // Calculate task counts with all priority levels
  const taskCounts = _.range(1, 6).reduce((acc, level) => {
    acc[level] = _.filter(
      processedTasks,
      (task) => task.priority === level
    ).length;
    return acc;
  }, {});

  return {
    groupedTasks: priorityLevels,
    overdueSummary,
    taskCounts,
  };
}

module.exports = { generateTaskReport };