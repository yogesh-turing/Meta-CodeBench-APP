const { generateTaskReport } = require('./incorrect');

const _ = require("lodash");

describe("generateTaskReport", () => {
  it("should group and sort tasks correctly by priority and deadline", () => {
    const tasks = [
      { id: 1, name: "Submit report", priority: 3, deadline: "2024-12-25" },
      {
        id: 2,
        name: "Prepare presentation",
        priority: 1,
        deadline: "2024-12-20",
      },
      { id: 3, name: "Code review", priority: 2, deadline: "2024-12-26" },
      { id: 4, name: "Team meeting", priority: 1, deadline: "2024-12-19" },
    ];

    const currentDate = new Date("2024-12-22");

    const expected = {
      1: [
        {
          id: 4,
          name: "Team meeting",
          priority: 1,
          deadline: "2024-12-19",
          overdue: true,
        },
        {
          id: 2,
          name: "Prepare presentation",
          priority: 1,
          deadline: "2024-12-20",
          overdue: true,
        },
      ],
      2: [
        {
          id: 3,
          name: "Code review",
          priority: 2,
          deadline: "2024-12-26",
          overdue: false,
        },
      ],
      3: [
        {
          id: 1,
          name: "Submit report",
          priority: 3,
          deadline: "2024-12-25",
          overdue: false,
        },
      ],
      4: [],
      5: [],
    };

    jest.useFakeTimers().setSystemTime(currentDate);
    expect(generateTaskReport(tasks).groupedTasks).toEqual(expected);
    jest.useRealTimers();
  });

  it("should return empty groups for all priorities when input task list is empty", () => {
    const tasks = [];
    const expected = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    expect(generateTaskReport(tasks).groupedTasks).toEqual(expected);
  });

  it("should handle tasks with invalid deadlines gracefully", () => {
    const tasks = [
      {
        id: 1,
        name: "Task with invalid date",
        priority: 3,
        deadline: "invalid-date",
      },
      { id: 2, name: "Valid task", priority: 1, deadline: "2024-12-20" },
    ];

    const currentDate = new Date("2024-12-22");

    const expected = {
      1: [
        {
          id: 2,
          name: "Valid task",
          priority: 1,
          deadline: "2024-12-20",
          overdue: true,
        },
      ],
      2: [],
      3: [
        {
          id: 1,
          name: "Task with invalid date",
          priority: 3,
          deadline: "invalid-date",
          overdue: false,
        },
      ],
      4: [],
      5: [],
    };

    jest.useFakeTimers().setSystemTime(currentDate);
    expect(generateTaskReport(tasks).groupedTasks).toEqual(expected);
    jest.useRealTimers();
  });

  it("should handle tasks with duplicate priorities and deadlines correctly", () => {
    const tasks = [
      { id: 1, name: "Task A", priority: 2, deadline: "2024-12-25" },
      { id: 2, name: "Task B", priority: 2, deadline: "2024-12-25" },
    ];

    const currentDate = new Date("2024-12-22");

    const expected = {
      1: [],
      2: [
        {
          id: 1,
          name: "Task A",
          priority: 2,
          deadline: "2024-12-25",
          overdue: false,
        },
        {
          id: 2,
          name: "Task B",
          priority: 2,
          deadline: "2024-12-25",
          overdue: false,
        },
      ],
      3: [],
      4: [],
      5: [],
    };

    jest.useFakeTimers().setSystemTime(currentDate);
    expect(generateTaskReport(tasks).groupedTasks).toEqual(expected);
    jest.useRealTimers();
  });

  it("should handle large datasets efficiently", () => {
    const tasks = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Task ${i + 1}`,
      priority: (i % 5) + 1,
      deadline: `2024-12-${15 + (i % 10)}`,
    }));

    const currentDate = new Date("2024-12-22");

    jest.useFakeTimers().setSystemTime(currentDate);
    const result = generateTaskReport(tasks).groupedTasks;
    expect(Object.keys(result)).toHaveLength(5);
    expect(result[1].length).toBeGreaterThan(0);
    jest.useRealTimers();
  });

  it("should handle tasks spanning across all priorities", () => {
    const tasks = [
      { id: 1, name: "Priority 1", priority: 1, deadline: "2024-12-22" },
      { id: 2, name: "Priority 2", priority: 2, deadline: "2024-12-23" },
      { id: 3, name: "Priority 3", priority: 3, deadline: "2024-12-24" },
      { id: 4, name: "Priority 4", priority: 4, deadline: "2024-12-25" },
      { id: 5, name: "Priority 5", priority: 5, deadline: "2024-12-26" },
    ];

    const currentDate = new Date("2024-12-22");

    const expected = {
      1: [
        {
          id: 1,
          name: "Priority 1",
          priority: 1,
          deadline: "2024-12-22",
          overdue: false,
        },
      ],
      2: [
        {
          id: 2,
          name: "Priority 2",
          priority: 2,
          deadline: "2024-12-23",
          overdue: false,
        },
      ],
      3: [
        {
          id: 3,
          name: "Priority 3",
          priority: 3,
          deadline: "2024-12-24",
          overdue: false,
        },
      ],
      4: [
        {
          id: 4,
          name: "Priority 4",
          priority: 4,
          deadline: "2024-12-25",
          overdue: false,
        },
      ],
      5: [
        {
          id: 5,
          name: "Priority 5",
          priority: 5,
          deadline: "2024-12-26",
          overdue: false,
        },
      ],
    };

    jest.useFakeTimers().setSystemTime(currentDate);
    expect(generateTaskReport(tasks).groupedTasks).toEqual(expected);
    jest.useRealTimers();
  });

  it("should correctly summarize overdue tasks by priority", () => {
    const tasks = [
      { id: 1, name: "Task 1", priority: 1, deadline: "2024-12-20" },
      { id: 2, name: "Task 2", priority: 2, deadline: "2024-12-22" },
      { id: 3, name: "Task 3", priority: 3, deadline: "2024-12-21" },
      { id: 4, name: "Task 4", priority: 1, deadline: "2024-12-18" },
    ];

    const currentDate = new Date("2024-12-22");

    const expectedOverdueSummary = {
      1: 2,
      2: 0,
      3: 1,
      4: 0,
      5: 0,
    };

    jest.useFakeTimers().setSystemTime(currentDate);
    expect(generateTaskReport(tasks).overdueSummary).toEqual(
      expectedOverdueSummary
    );
    jest.useRealTimers();
  });

  it("should count tasks correctly by priority", () => {
    const tasks = [
      { id: 1, name: "Task 1", priority: 1, deadline: "2024-12-22" },
      { id: 2, name: "Task 2", priority: 1, deadline: "2024-12-22" },
      { id: 3, name: "Task 3", priority: 2, deadline: "2024-12-22" },
      { id: 4, name: "Task 4", priority: 3, deadline: "2024-12-22" },
      { id: 5, name: "Task 5", priority: 1, deadline: "2024-12-22" },
    ];

    const expectedTaskCounts = {
      1: 3,
      2: 1,
      3: 1,
      4: 0,
      5: 0,
    };

    jest.useFakeTimers().setSystemTime(new Date("2024-12-22"));
    expect(generateTaskReport(tasks).taskCounts).toEqual(expectedTaskCounts);
    jest.useRealTimers();
  });

  it("should return zero counts for priorities with no tasks", () => {
    const tasks = [
      { id: 1, name: "Task 1", priority: 1, deadline: "2024-12-22" },
      { id: 2, name: "Task 2", priority: 1, deadline: "2024-12-22" },
    ];

    const expectedTaskCounts = {
      1: 2,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    jest.useFakeTimers().setSystemTime(new Date("2024-12-22"));
    expect(generateTaskReport(tasks).taskCounts).toEqual(expectedTaskCounts);
    jest.useRealTimers();
  });
});