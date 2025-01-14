const _ = require("lodash");

function generateTaskReport(tasks) {
  const currentDate = new Date();

  // Process tasks and add overdue property
  const processedTasks = tasks.map((task) => ({
    ...task,
    overdue: task.deadline ? new Date(task.deadline) <= currentDate : false,
  }));

  // Group tasks by priority and sort by deadline
  const groupedTasks = _.groupBy(processedTasks, "priority");

  // Initialize priority levels with empty arrays and sort tasks by deadline
  const priorityLevels = _.range(1, 6).reduce((acc, level) => {
    acc[level] = (groupedTasks[level] || []).sort((a, b) => 
      new Date(a.deadline) - new Date(b.deadline)
    );
    return acc;
  }, {});

  // Calculate overdue summary with zeros for missing priorities
  const overdueSummary = _.range(1, 6).reduce((acc, level) => {
    acc[level] = (groupedTasks[level] || [])
      .filter(task => task.overdue)
      .length;
    return acc;
  }, {});

  // Calculate task counts with zeros for missing priorities
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