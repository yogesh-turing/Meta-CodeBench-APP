const _ = require("lodash");

function generateTaskReport(tasks) {
  const currentDate = new Date();

  // Fix the overdue calculation
  const processedTasks = tasks.map((task) => ({
    ...task,
    overdue: task.deadline ? new Date(task.deadline) <= currentDate : false,
  }));

  // Group and sort tasks
  const groupedTasks = _.chain(processedTasks)
    .groupBy("priority")
    .mapValues((group) => 
      _.orderBy(group, [(task) => new Date(task.deadline)], ['asc'])
    )
    .value();

  // Initialize priority levels with empty arrays
  const priorityLevels = _.range(1, 6).reduce((acc, level) => {
    acc[level] = groupedTasks[level] || [];
    return acc;
  }, {});

  // Calculate overdue summary with all priority levels
  const overdueSummary = _.range(1, 6).reduce((acc, level) => {
    acc[level] = _.filter(processedTasks, 
      task => task.priority === level && task.overdue
    ).length;
    return acc;
  }, {});

  // Calculate task counts with all priority levels
  const taskCounts = _.range(1, 6).reduce((acc, level) => {
    acc[level] = (groupedTasks[level] || []).length;
    return acc;
  }, {});

  return {
    groupedTasks: priorityLevels,
    overdueSummary,
    taskCounts,
  };
}

module.exports = { generateTaskReport };