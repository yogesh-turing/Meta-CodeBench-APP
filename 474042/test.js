//TeacherTransferManager.test.js
const { TeacherTransferManager } = require("./solution");

describe("TeacherTransferManager", () => {
  let manager;

  beforeEach(() => {
    manager = new TeacherTransferManager();
  });

  // Basic Functionality Tests

  test("should correctly store and update department inventory when adding positions", () => {
    manager.addPositions({
      department: "Science",
      positionTitle: "Professor",
      count: 5,
    });
    manager.addPositions({
      department: "Science",
      positionTitle: "Professor",
      count: 3,
    });

    expect(manager.totalPositions("Professor")).toBe(8);
  });

  test("totalPositions() should return correct available positions across departments", () => {
    manager.addPositions({
      department: "Math",
      positionTitle: "Lecturer",
      count: 4,
    });
    manager.addPositions({
      department: "Science",
      positionTitle: "Lecturer",
      count: 6,
    });

    expect(manager.totalPositions("Lecturer")).toBe(10);
  });

  test("should reduce available positions correctly when transferring a teacher", () => {
    manager.addPositions({
      department: "Math",
      positionTitle: "Assistant Professor",
      count: 2,
    });
    manager.transferTeacher({
      department: "Math",
      positionTitle: "Assistant Professor",
    });

    expect(manager.totalPositions("Assistant Professor")).toBe(1);
  });

  test("should return accurate position counts when checking department inventory", () => {
    manager.addPositions({
      department: "English",
      positionTitle: "Senior Lecturer",
      count: 3,
    });

    expect(manager.departmentInventory("English")).toEqual([
      { positionTitle: "Senior Lecturer", available: 3 },
    ]);
  });

  // ✅ Edge Case Tests ✅

  test("should throw error when adding a position with zero or negative count", () => {
    expect(() =>
      manager.addPositions({
        department: "Science",
        positionTitle: "Professor",
        count: 0,
      })
    ).toThrow("Invalid position count");

    expect(() =>
      manager.addPositions({
        department: "Science",
        positionTitle: "Professor",
        count: -5,
      })
    ).toThrow("Invalid position count");
  });

  test("should update count instead of creating duplicates when adding the same position twice", () => {
    manager.addPositions({
      department: "History",
      positionTitle: "Research Assistant",
      count: 2,
    });
    manager.addPositions({
      department: "History",
      positionTitle: "Research Assistant",
      count: 3,
    });

    expect(manager.departmentInventory("History")).toEqual([
      { positionTitle: "Research Assistant", available: 5 },
    ]);
  });

  test("totalPositions() should return 'Position not available' for unknown roles", () => {
    expect(manager.totalPositions("UnknownRole")).toBe(
      "Position not available"
    );
  });

  test("should throw error when transferring a teacher to a department with no available positions", () => {
    manager.addPositions({
      department: "Physics",
      positionTitle: "Lab Instructor",
      count: 1,
    });
    manager.transferTeacher({
      department: "Physics",
      positionTitle: "Lab Instructor",
    });

    expect(() =>
      manager.transferTeacher({
        department: "Physics",
        positionTitle: "Lab Instructor",
      })
    ).toThrow("Position not available");
  });

  test("departmentInventory() should return 'Department not found' for an unknown department", () => {
    expect(manager.departmentInventory("UnknownDept")).toBe(
      "Department not found"
    );
  });

  // ✅ Input Validation Tests ✅

  test("should throw error for invalid department name when adding positions", () => {
    expect(() =>
      manager.addPositions({
        department: "",
        positionTitle: "Professor",
        count: 5,
      })
    ).toThrow("Invalid department identifier");

    expect(() =>
      manager.addPositions({
        department: "   ",
        positionTitle: "Professor",
        count: 5,
      })
    ).toThrow("Invalid department identifier");
  });

  test("should throw error for invalid position title when adding positions", () => {
    expect(() =>
      manager.addPositions({ department: "Math", positionTitle: "", count: 5 })
    ).toThrow("Invalid position title");

    expect(() =>
      manager.addPositions({
        department: "Math",
        positionTitle: "   ",
        count: 5,
      })
    ).toThrow("Invalid position title");
  });

  test("should throw error for invalid department name when transferring a teacher", () => {
    expect(() =>
      manager.transferTeacher({ department: "", positionTitle: "Professor" })
    ).toThrow("Invalid department identifier");

    expect(() =>
      manager.transferTeacher({ department: "   ", positionTitle: "Professor" })
    ).toThrow("Invalid department identifier");
  });

  test("should throw error for invalid position title when transferring a teacher", () => {
    expect(() =>
      manager.transferTeacher({ department: "Math", positionTitle: "" })
    ).toThrow("Invalid position title");

    expect(() =>
      manager.transferTeacher({ department: "Math", positionTitle: "   " })
    ).toThrow("Invalid position title");
  });
});
