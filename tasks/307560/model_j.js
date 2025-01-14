const _ = require("lodash");

function generateTaskReport(tasks) {
  const currentDate = new Date();

  const processedTasks = tasks.map((task) => ({
    ...task,
    overdue: task.deadline ? new Date(task.deadline) < currentDate : false,
  }));

  const groupedTasks = _.chain(processedTasks)
    .groupBy("priority")
    .map((group) =>
      _.orderBy(group, (task) => new Date(task.deadline))
    )
    .value();

  const priorityLevels = _.range(1, 6).reduce((acc, level) => {
    acc[level] = groupedTasks[level] || [];
    return acc;
  }, {});

  const overdueSummary = _.chain(processedTasks)
    .filter("overdue")
    .countBy("priority")
    .value();

  const taskCounts = _.countBy(processedTasks, "priority");

  // Ensure all priority levels are included in overdueSummary and taskCounts
  _.range(1, 6).forEach((level) => {
    if (!overdueSummary[level]) {
      overdueSummary[level] = 0;
    }
    if (!taskCounts[level]) {
      taskCounts[level] = 0;
    }
  });

  return {
    groupedTasks: priorityLevels,
    overdueSummary,
    taskCounts,
  };
}

module.exports = { generateTaskReport };