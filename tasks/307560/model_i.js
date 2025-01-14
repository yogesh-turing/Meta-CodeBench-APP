const _ = require("lodash");

function generateTaskReport(tasks) {
  const currentDate = new Date();

  const processedTasks = tasks.map((task) => ({
    ...task,
    overdue: task.deadline ? new Date(task.deadline) <= currentDate : false,
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
    .groupBy("priority")
    .mapValues((group) => group.length)
    .value();

  const taskCounts = _.countBy(processedTasks, "priority");

  const fullTaskCounts = _.range(1, 6).reduce((acc, level) => {
    acc[level] = taskCounts[level] || 0;
    return acc;
  }, {});

  const fullOverdueSummary = _.range(1, 6).reduce((acc, level) => {
    acc[level] = overdueSummary[level] || 0;
    return acc;
  }, {});

  return {
    groupedTasks: priorityLevels,
    overdueSummary: fullOverdueSummary,
    taskCounts: fullTaskCounts,
  };
}

module.exports = { generateTaskReport };