const { Employee } = require("./correct");

describe("Employee Hierarchy Tests", () => {
  let ceo, vp1, vp2, manager1, employee1, employee2;

  beforeEach(() => {
    // Create the employee hierarchy
    ceo = new Employee("Alice", "e1", 50);
    vp1 = new Employee("Bob", "e2", 45);
    vp2 = new Employee("Charlie", "e3", 47);
    manager1 = new Employee("David", "e4", 40);
    employee1 = new Employee("Frank", "e5", 38);
    employee2 = new Employee("Grace", "e6", 36);

    // Build the hierarchy
    ceo.addTeamMember(vp1);
    ceo.addTeamMember(vp2);
    vp1.addTeamMember(manager1);
    manager1.addTeamMember(employee1);
    manager1.addTeamMember(employee2);
  });

  test("Employee hierarchy is correctly structured", () => {
    const expectedHierarchy = {
      empId: "e1",
      name: "Alice",
      hoursWorked: 50,
      team: [
        {
          empId: "e2",
          name: "Bob",
          hoursWorked: 45,
          team: [
            {
              empId: "e4",
              name: "David",
              hoursWorked: 40,
              team: [
                {
                  empId: "e5",
                  name: "Frank",
                  hoursWorked: 38,
                  team: [],
                },
                {
                  empId: "e6",
                  name: "Grace",
                  hoursWorked: 36,
                  team: [],
                },
              ],
            },
          ],
        },
        {
          empId: "e3",
          name: "Charlie",
          hoursWorked: 47,
          team: [],
        },
      ],
    };

    expect(ceo.toJSON()).toEqual(expectedHierarchy);
  });

  test("getAverageHoursWorked for a team", () => {
    const averageHours = vp1.getAverageHoursWorked("e2"); // Bob's team
    expect(averageHours).toBe(39); // (45 + 40 + 38 + 36) / 4 = 39
  });

  test("getAverageHoursWorked for employee which dont exist ", () => {
    expect(() => {
      vp1.getAverageHoursWorked("e999"); // Invalid ID
    }).toThrow("Employee is not present");
  });

  test("moveTeam successfully moves a team(Move David's team(empId:e4) under Bob team(empId:e2)", () => {
    // Expected hierarchy before moving
        const expectedBeforeMove = {
          empId: "e1",
          name: "Alice",
          hoursWorked: 50,
          team: [
            {
              empId: "e2",
              name: "Bob",
              hoursWorked: 45,
              team: [
                {
                  empId: "e4",
                  name: "David",
                  hoursWorked: 40,
                  team: [
                    {
                      empId: "e5",
                      name: "Frank",
                      hoursWorked: 38,
                      team: [],
                    },
                    {
                      empId: "e6",
                      name: "Grace",
                      hoursWorked: 36,
                      team: [],
                    },
                  ],
                },
              ],
            },
            {
              empId: "e3",
              name: "Charlie",
              hoursWorked: 47,
              team: [],
            },
          ],
        };

    expect(ceo.toJSON()).toEqual(expectedBeforeMove);

    // Move David's team under Bob
    vp1.moveTeam("e4", "e2");

    // Expected hierarchy after moving
    const expectedAfterMove = {
      empId: "e1",
      name: "Alice",
      hoursWorked: 50,
      team: [
        {
          empId: "e2",
          name: "Bob",
          hoursWorked: 45,
          team: [
            {
              empId: "e4",
              name: "David",
              hoursWorked: 40,
              team: [],
            },
            {
              empId: "e5",
              name: "Frank",
              hoursWorked: 38,
              team: [],
            },
            {
              empId: "e6",
              name: "Grace",
              hoursWorked: 36,
              team: [],
            },
          ],
        },
        {
          empId: "e3",
          name: "Charlie",
          hoursWorked: 47,
          team: [],
        },
      ],
    };

    expect(ceo.toJSON()).toEqual(expectedAfterMove);
  });

  test("getAverageHoursWorked for an employee without a team", () => {
    const averageHours = vp2.getAverageHoursWorked("e3");
    expect(averageHours).toBe(47);
  });
  test("should throw an error if the source employee does not exist", () => {
    expect(() => {
      ceo.moveTeam("non-existing-id", "e2"); // Invalid source ID
    }).toThrow("Employee is not present");
  });
  test("should throw an error if the destination employee does not exist", () => {
    expect(() => {
      ceo.moveTeam("e2", "non-existing-id"); // Valid source ID, invalid destination ID
    }).toThrow("Employee is not present");
  });
  test("should throw an error if both employees source as well as destination does not exist", () => {
    expect(() => {
      ceo.moveTeam("non-existing-id-1", "non-existing-id-2"); // Both IDs invalid
    }).toThrow("Employee is not present");
  });

  test("should throw an error if trying to add a team member with the same ID", () => {
    const duplicateEmployee = new Employee("Charlie", "e2", 40); // Same ID as vp1

    expect(() => {
      ceo.addTeamMember(duplicateEmployee); // Attempt to add with a duplicate ID
    }).toThrow("Same Employee Id");
  });

  test("should throw an error if trying to add a team member or instantiating employee with the name which is not of string type", () => {
    expect(() => new Employee(123, "e6", 40)).toThrow("Invalid Input");
  });

  test("should throw an error if trying to add a team member or instantiating employee with the empId which is not of string type", () => {
    expect(() => new Employee("charlie", 123, 40)).toThrow("Invalid Input");
  });

  test("should throw an error if trying to add a team member  or instantiating employee with the hoursWorked which is not of number type", () => {
    expect(() => new Employee("Charlie", "e6", "40")).toThrow("Invalid Input");
  });
});