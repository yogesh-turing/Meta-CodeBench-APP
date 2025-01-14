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
        acc[level] = groupedTasks[level] || []; // Ensure empty array for missing priorities
        return acc;
    }, {});

    const overdueSummary = _.chain(processedTasks)
        .filter("overdue")
        .groupBy("priority")
        .mapValues((group) => group.length)
        .value();

    // Fill in zero for priorities with no overdue tasks
    _.range(1, 6).forEach((level) => {
        if (!overdueSummary[level]) {
            overdueSummary[level] = 0;
        }
    });

    const taskCounts = _.countBy(processedTasks, "priority");

    // Fill in zero for priorities with no tasks
    _.range(1, 6).forEach((level) => {
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