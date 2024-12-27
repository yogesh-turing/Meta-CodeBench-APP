const Model = require(process.env.TARGET_FILE);
const assert = require("assert");

describe("function checks", () => {
it("should have csvToHierarchicalJson function", () => {
  assert.strictEqual(typeof Model.csvToHierarchicalJson, "function");
});

it("should have validateCsv function", () => {
  assert.strictEqual(typeof Model.validateCsv, "function");
});

it("should have parseHeaders function", () => {
  assert.strictEqual(typeof Model.parseHeaders, "function");
});

it("should have parseData function", () => {
  assert.strictEqual(typeof Model.parseData, "function");
});

it("should have buildHierarchy function", () => {
  assert.strictEqual(typeof Model.buildHierarchy, "function");
});

it("should have checkDuplicate function", () => {
  assert.strictEqual(typeof Model.checkDuplicate, "function");
});

});

describe("validateCsv", () => {
// null input
it("should throw error if input is null", () => {
  assert.throws(() => Model.validateCsv(null), Error);
});

// undefined input
it("should throw error if input is undefined", () => {
  assert.throws(() => Model.validateCsv(undefined), Error);
});

// empty input
it("should throw error if input is empty", () => {
  assert.throws(() => Model.validateCsv(""), Error);
});

// invalid input
it("should throw error if input is invalid", () => {
  assert.throws(() => Model.validateCsv("invalid"), Error);
});

// valid input
it("should return an array if input is valid", () => {
  const csv = `id,task,parentId
1,Task 1,0
2,Task 2,0
3,Task 3,1
4,Task 4,1
5,Task 5,2
6,Task 6,2`;
  assert.strictEqual(Array.isArray(Model.validateCsv(csv)), true);
});

// valid input with header only
it("should throw error if input has header only", () => {
  const csv = `id,task,parentId`;
  assert.throws(() => Model.validateCsv(csv), Error);
});
});

describe("parseHeaders", () => {
// null input
it("should throw error if input is null", () => {
  assert.throws(() => Model.parseHeaders(null), Error);
});

// undefined input
it("should throw error if input is undefined", () => {
  assert.throws(() => Model.parseHeaders(undefined), Error);
});

// empty input
it("should throw error if input is empty", () => {
  assert.throws(() => Model.parseHeaders(""), Error);
});

// invalid input
it("should throw error if input is invalid", () => {
  assert.throws(() => Model.parseHeaders(123), Error);
});

// valid input
it("should return an array if input is valid", () => {
  const csv = `id,task,parentId
  1,Task 1,0
  2,Task 2,0
  3,Task 3,1
  4,Task 4,1
  5,Task 5,2`;
  assert.strictEqual(Array.isArray(Model.parseHeaders(csv)), true);
});
});

describe("parseData", () => {
// null input
it("should throw error if input is null", () => {
  assert.throws(() => Model.parseData(null), Error);
});

// undefined input
it("should throw error if input is undefined", () => {
  assert.throws(() => Model.parseData(undefined), Error);
});

// empty input
it("should throw error if input is empty", () => {
  assert.throws(() => Model.parseData(""), Error);
});

// invalid input
it("should throw error if input is invalid", () => {
  assert.throws(() => Model.parseData(123), Error);
});

// valid input
it("should return an array if input is valid", () => {
  const csv = `id,task,parentId
      1,Task 1,0
      2,Task 2,0
      3,Task 3,1
      4,Task 4,1
      5,Task 5,2`;
  const lines = Model.validateCsv(csv);
  const headers = Model.parseHeaders(lines[0]);
  assert.strictEqual(
    Array.isArray(Model.parseData(lines.slice(1), headers)),
    true
  );
});
});

describe("csvToHierarchicalJson", () => {
it("should convert CSV to hierarchical JSON", () => {
  const csv = `id,task,parentId
1,Task 1,0
2,Task 2,0
3,Task 3,1
4,Task 4,1
5,Task 5,2
6,Task 6,2`;
  const expected = [
    {
      id: "1",
      task: "Task 1",
      parentId: "0",
      children: [
        {
          id: "3",
          task: "Task 3",
          parentId: "1",
          children: [],
        },
        {
          id: "4",
          task: "Task 4",
          parentId: "1",
          children: [],
        },
      ],
    },
    {
      id: "2",
      task: "Task 2",
      parentId: "0",
      children: [
        {
          id: "5",
          task: "Task 5",
          parentId: "2",
          children: [],
        },
        {
          id: "6",
          task: "Task 6",
          parentId: "2",
          children: [],
        },
      ],
    },
  ];
  assert.deepStrictEqual(Model.csvToHierarchicalJson(csv), expected);
});

it("should convert CSV to hierarchical JSON with multiple levels", () => {
  const csv = `id,task,parentId
1,Task 1,0
2,Task 2,1
3,Task 3,2
4,Task 4,3
5,Task 5,4`;
  const expected = [
    {
      id: "1",
      task: "Task 1",
      parentId: "0",
      children: [
        {
          id: "2",
          task: "Task 2",
          parentId: "1",
          children: [
            {
              id: "3",
              task: "Task 3",
              parentId: "2",
              children: [
                {
                  id: "4",
                  task: "Task 4",
                  parentId: "3",
                  children: [
                    {
                      id: "5",
                      task: "Task 5",
                      parentId: "4",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  assert.deepStrictEqual(Model.csvToHierarchicalJson(csv), expected);
});

it("should convert CSV to hierarchical JSON with multiple roots", () => {
  const csv = `id,task,parentId
1,Task 1,0
2,Task 2,0
3,Task 3,0
4,Task 4,0
5,Task 5,0`;
  const expected = [
    {
      id: "1",
      task: "Task 1",
      parentId: "0",
      children: [],
    },
    {
      id: "2",
      task: "Task 2",
      parentId: "0",
      children: [],
    },
    {
      id: "3",
      task: "Task 3",
      parentId: "0",
      children: [],
    },
    {
      id: "4",
      task: "Task 4",
      parentId: "0",
      children: [],
    },
    {
      id: "5",
      task: "Task 5",
      parentId: "0",
      children: [],
    },
  ];
  assert.deepStrictEqual(Model.csvToHierarchicalJson(csv), expected);
});

it("should convert CSV to hierarchical JSON with no children", () => {
  const csv = `id,task,parentId
1,Task 1,0
2,Task 2,0
3,Task 3,0
4,Task 4,0
5,Task 5,0`;
  const expected = [
    {
      id: "1",
      task: "Task 1",
      parentId: "0",
      children: [],
    },
    {
      id: "2",
      task: "Task 2",
      parentId: "0",
      children: [],
    },
    {
      id: "3",
      task: "Task 3",
      parentId: "0",
      children: [],
    },
    {
      id: "4",
      task: "Task 4",
      parentId: "0",
      children: [],
    },
    {
      id: "5",
      task: "Task 5",
      parentId: "0",
      children: [],
    },
  ];
  assert.deepStrictEqual(Model.csvToHierarchicalJson(csv), expected);
});

it("should convert CSV to hierarchical JSON with one root", () => {
  const csv = `id,task,parentId
1,Task 1,0`;
  const expected = [
    {
      id: "1",
      task: "Task 1",
      parentId: "0",
      children: [],
    },
  ];
  assert.deepStrictEqual(Model.csvToHierarchicalJson(csv), expected);
});

it("should convert CSV to hierarchical JSON with one child", () => {
  const csv = `id,task,parentId
1,Task 1,0
2,Task 2,1`;
  const expected = [
    {
      id: "1",
      task: "Task 1",
      parentId: "0",
      children: [
        {
          id: "2",
          task: "Task 2",
          parentId: "1",
          children: [],
        },
      ],
    },
  ];
  assert.deepStrictEqual(Model.csvToHierarchicalJson(csv), expected);
});

// parent id is not found
it("should convert CSV to hierarchical JSON with parent id not found", () => {
  const csv = `id,task,parentId
1,Task 1,2
2,Task 2,0`;
  const expected = [
    {
      id: "2",
      task: "Task 2",
      parentId: "0",
      children: [],
    },
  ];
  assert.deepStrictEqual(Model.csvToHierarchicalJson(csv), expected);
});

// parent id is null
it("should convert CSV to hierarchical JSON with parent id null", () => {
  const csv = `id,task,parentId
1,Task 1,0
2,Task 2,null`;
  const expected = [
    {
      id: "1",
      task: "Task 1",
      parentId: "0",
      children: [],
    },
    {
      id: "2",
      task: "Task 2",
      parentId: "null",
      children: [],
    },
  ];
  assert.deepStrictEqual(Model.csvToHierarchicalJson(csv), expected);
});
});