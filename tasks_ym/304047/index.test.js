const {csvToHierarchicalJson} = require(process.env.TARGET_FILE);

describe("csvToHierarchicalJson", () => {
  test("should convert CSV to hierarchical JSON", async () => {
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
    const actual = await csvToHierarchicalJson(csv);
    expect(actual).toEqual(expected);
  });

  test("should convert CSV to hierarchical JSON with multiple levels", async () => {
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
    const actual = await csvToHierarchicalJson(csv);
    expect(actual).toEqual(expected);
  });

  test("should convert CSV to hierarchical JSON with multiple roots", async () => {
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
    const actual = await csvToHierarchicalJson(csv);
    expect(actual).toEqual(expected);
  });

  test("should convert CSV to hierarchical JSON with no children", async () => {
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
    const actual = await csvToHierarchicalJson(csv);
    expect(actual).toEqual(expected);
  });

  test("should convert CSV to hierarchical JSON with one root", async () => {
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
    const actual = await csvToHierarchicalJson(csv);
    expect(actual).toEqual(expected);
  });

  test("should convert CSV to hierarchical JSON with one child", async () => {
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
    const actual = await csvToHierarchicalJson(csv);
    expect(actual).toEqual(expected);
  });

  test("should convert CSV to hierarchical JSON with parent id not found", async () => {
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
    console.warn = jest.fn(); // Mock console.warn
    const actual = await csvToHierarchicalJson(csv);
    expect(actual).toEqual(expected);
  });

  test("should convert CSV to hierarchical JSON with invalid parent id having javascirpt falsy values", async () => {
    const csv = `id,task,parentId
1,Task 1,0
2,Task 2,null
3,Task 3,undefined
4,Task 4,false
5,Task 5,NaN
6,Task 6,-0
8,Task 8,''
9,Task 9,`;
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
      {
        id: "3",
        task: "Task 3",
        parentId: "undefined",
        children: [],
      },
      {
        id: "4",
        task: "Task 4",
        parentId: "false",
        children: [],
      },
      {
        id: "5",
        task: "Task 5",
        parentId: "NaN",
        children: [],
      },
      {
        id: "6",
        task: "Task 6",
        parentId: "-0",
        children: [],
      },
      {
        id: "8",
        task: "Task 8",
        parentId: "''",
        children: [],
      },
      {
        id: "9",
        task: "Task 9",
        parentId: "",
        children: [],
      }
    ];
    console.warn = jest.fn(); // Mock console.warn
    const actual = await csvToHierarchicalJson(csv);
    expect(actual).toEqual(expected);
  });
});