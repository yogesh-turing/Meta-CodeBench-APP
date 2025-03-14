Base Code:
```javascript
class Employee {
  constructor(name, empId, hoursWorked) {
    if (typeof name !== "string") {
      throw new Error("Employee name must be a string");
    }
    if (typeof empId !== "string") {
      throw new Error("Employee ID must be a string");
    }
    if (typeof hoursWorked !== "number") {
      throw new Error("Hours worked must be a number");
    }

    this.name = name;
    this.empId = empId;
    this.hoursWorked = hoursWorked;
    this.team = []; // Array to hold subordinates (team members)
  }

  addTeamMember(employee) {
    if (this.team.find((member) => member.empId === employee.empId)) {
      throw new Error("Same Employee");
    }
    this.team.push(employee);
  }

  getEmployeeData(empId) {
    // Check if this employee matches the ID
    if (this.empId === empId) {
      return {
        empId: this.empId,
        name: this.name,
        hoursWorked: this.hoursWorked,
        team: this.team.map((member) => member.getEmployeeData(member.empId)),
      };
    }

    // Recursively search in the team
    for (const member of this.team) {
      const data = member.getEmployeeData(empId);
      if (data) {
        return data;
      }
    }

    return null;
  }

  toJSON() {
    return {
      empId: this.empId,
      name: this.name,
      hoursWorked: this.hoursWorked,
      team: this.team.map((member) => member.toJSON()),
    };
  }

  getAverageHoursWorked(empId) {
    const employee = this.getEmployeeData(empId);
    if (!employee) {
      throw new Error("Employee does not exist");
    }

    const totalHours =
      employee.hoursWorked +
      employee.team.reduce((acc, member) => acc + member.hoursWorked, 0);
    const totalMembers = employee.team.length + 1;
    return Math.floor(totalHours / totalMembers);
  }

  moveTeam(sourceTeamEmployeeId, destinationTeamEmployeeId) {
    const sourceEmployee = this.getEmployeeData(sourceTeamEmployeeId);
    if (!sourceEmployee) {
      throw new Error("Employee is not present");
    }

    const destinationEmployee = this.getEmployeeData(destinationTeamEmployeeId);
    if (!destinationEmployee) {
      throw new Error("Employee is not present");
    }

    // Remove the source employee from its current team
    const sourceTeam = this.team.find(
      (member) => member.empId === sourceTeamEmployeeId
    );
    if (sourceTeam) {
      this.team = this.team.filter(
        (member) => member.empId !== sourceTeamEmployeeId
      );
    }

    // Add the source employee to the destination team
    destinationEmployee.team.push(sourceEmployee);
    destinationEmployee.team.sort((a, b) => a.empId.localeCompare(b.empId));
  }
}

module.exports = { Employee };
```

Stack Trace:
```javascript
 Employee Hierarchy Tests
    ✓ Employee hierarchy is correctly structured (2 ms)
    ✕ getAverageHoursWorked for a team (1 ms)
    ✕ getAverageHoursWorked for employee which dont exist  (10 ms)
    ✕ moveTeam successfully moves a team(Move David's team(empId:e4) under Bob team(empId:e2) (3 ms)
    ✓ getAverageHoursWorked for an employee without a team
    ✓ should throw an error if the source employee does not exist
    ✓ should throw an error if the destination employee does not exist
    ✓ should throw an error if both employees source as well as destination does not exist
    ✕ should throw an error if trying to add a team member with the same ID (2 ms)
    ✕ should throw an error if trying to add a team member or instantiating employee with the name which is not of string type (1 ms)
    ✕ should throw an error if trying to add a team member or instantiating employee with the empId which is not of string type (1 ms)
    ✕ should throw an error if trying to add a team member  or instantiating employee with the hoursWorked which is not of number type (1 ms)

  ● Employee Hierarchy Tests › getAverageHoursWorked for a team

    expect(received).toBe(expected) // Object.is equality

    Expected: 39
    Received: 42

      67 |   test("getAverageHoursWorked for a team", () => {
      68 |     const averageHours = vp1.getAverageHoursWorked("e2"); // Bob's team
    > 69 |     expect(averageHours).toBe(39); // (45 + 40 + 38 + 36) / 4 = 39
         |                          ^
      70 |   });
      71 |
      72 |   test("getAverageHoursWorked for employee which dont exist ", () => {

      at Object.toBe (WordCloud.test.js:69:26)

  ● Employee Hierarchy Tests › getAverageHoursWorked for employee which dont exist 

    expect(received).toThrow(expected)

    Expected substring: "Employee is not present"
    Received message:   "Employee does not exist"

          58 |     const employee = this.getEmployeeData(empId);
          59 |     if (!employee) {
        > 60 |       throw new Error("Employee does not exist");
             |             ^
          61 |     }
          62 |
          63 |     const totalHours =

          at Employee.getAverageHoursWorked (Solution.js:60:13)
          at getAverageHoursWorked (WordCloud.test.js:74:11)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:75:8)

      73 |     expect(() => {
      74 |       vp1.getAverageHoursWorked("e999"); // Invalid ID
    > 75 |     }).toThrow("Employee is not present");
         |        ^
      76 |   });
      77 |
      78 |   test("moveTeam successfully moves a team(Move David's team(empId:e4) under Bob team(empId:e2)", () => {

      at Object.toThrow (WordCloud.test.js:75:8)

  ● Employee Hierarchy Tests › moveTeam successfully moves a team(Move David's team(empId:e4) under Bob team(empId:e2)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 19
    + Received  +  0

    @@ -5,30 +5,11 @@
        "team": Array [
          Object {
            "empId": "e2",
            "hoursWorked": 45,
            "name": "Bob",
    -       "team": Array [
    -         Object {
    -           "empId": "e4",
    -           "hoursWorked": 40,
    -           "name": "David",
            "team": Array [],
    -         },
    -         Object {
    -           "empId": "e5",
    -           "hoursWorked": 38,
    -           "name": "Frank",
    -           "team": Array [],
    -         },
    -         Object {
    -           "empId": "e6",
    -           "hoursWorked": 36,
    -           "name": "Grace",
    -           "team": Array [],
    -         },
    -       ],
          },
          Object {
            "empId": "e3",
            "hoursWorked": 47,
            "name": "Charlie",

      163 |     };
      164 |
    > 165 |     expect(ceo.toJSON()).toEqual(expectedAfterMove);
          |                          ^
      166 |   });
      167 |
      168 |   test("getAverageHoursWorked for an employee without a team", () => {

      at Object.toEqual (WordCloud.test.js:165:26)

  ● Employee Hierarchy Tests › should throw an error if trying to add a team member with the same ID

    expect(received).toThrow(expected)

    Expected substring: "Same Employee Id"
    Received message:   "Same Employee"

          19 |   addTeamMember(employee) {
          20 |     if (this.team.find((member) => member.empId === employee.empId)) {
        > 21 |       throw new Error("Same Employee");
             |             ^
          22 |     }
          23 |     this.team.push(employee);
          24 |   }

          at Employee.addTeamMember (Solution.js:21:13)
          at addTeamMember (WordCloud.test.js:192:11)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:193:8)

      191 |     expect(() => {
      192 |       ceo.addTeamMember(duplicateEmployee); // Attempt to add with a duplicate ID
    > 193 |     }).toThrow("Same Employee Id");
          |        ^
      194 |   });
      195 |
      196 |   test("should throw an error if trying to add a team member or instantiating employee with the name which is not of string type", () => {

      at Object.toThrow (WordCloud.test.js:193:8)

  ● Employee Hierarchy Tests › should throw an error if trying to add a team member or instantiating employee with the name which is not of string type

    expect(received).toThrow(expected)

    Expected substring: "Invalid Input"
    Received message:   "Employee name must be a string"

          2 |   constructor(name, empId, hoursWorked) {
          3 |     if (typeof name !== "string") {
        > 4 |       throw new Error("Employee name must be a string");
            |             ^
          5 |     }
          6 |     if (typeof empId !== "string") {
          7 |       throw new Error("Employee ID must be a string");

          at new Employee (Solution.js:4:13)
          at WordCloud.test.js:197:18
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:197:47)

      195 |
      196 |   test("should throw an error if trying to add a team member or instantiating employee with the name which is not of string type", () => {
    > 197 |     expect(() => new Employee(123, "e6", 40)).toThrow("Invalid Input");
          |                                               ^
      198 |   });
      199 |
      200 |   test("should throw an error if trying to add a team member or instantiating employee with the empId which is not of string type", () => {

      at Object.toThrow (WordCloud.test.js:197:47)

  ● Employee Hierarchy Tests › should throw an error if trying to add a team member or instantiating employee with the empId which is not of string type

    expect(received).toThrow(expected)

    Expected substring: "Invalid Input"
    Received message:   "Employee ID must be a string"

           5 |     }
           6 |     if (typeof empId !== "string") {
        >  7 |       throw new Error("Employee ID must be a string");
             |             ^
           8 |     }
           9 |     if (typeof hoursWorked !== "number") {
          10 |       throw new Error("Hours worked must be a number");

          at new Employee (Solution.js:7:13)
          at WordCloud.test.js:201:18
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:201:52)

      199 |
      200 |   test("should throw an error if trying to add a team member or instantiating employee with the empId which is not of string type", () => {
    > 201 |     expect(() => new Employee("charlie", 123, 40)).toThrow("Invalid Input");
          |                                                    ^
      202 |   });
      203 |
      204 |   test("should throw an error if trying to add a team member  or instantiating employee with the hoursWorked which is not of number type", () => {

      at Object.toThrow (WordCloud.test.js:201:52)

  ● Employee Hierarchy Tests › should throw an error if trying to add a team member  or instantiating employee with the hoursWorked which is not of number type

    expect(received).toThrow(expected)

    Expected substring: "Invalid Input"
    Received message:   "Hours worked must be a number"

           8 |     }
           9 |     if (typeof hoursWorked !== "number") {
        > 10 |       throw new Error("Hours worked must be a number");
             |             ^
          11 |     }
          12 |
          13 |     this.name = name;

          at new Employee (Solution.js:10:13)
          at WordCloud.test.js:205:18
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:205:55)

      203 |
      204 |   test("should throw an error if trying to add a team member  or instantiating employee with the hoursWorked which is not of number type", () => {
    > 205 |     expect(() => new Employee("Charlie", "e6", "40")).toThrow("Invalid Input");
          |                                                       ^
      206 |   });
      207 | });
      208 |

      at Object.toThrow (WordCloud.test.js:205:55)

Test Suites: 1 failed, 1 total
Tests:       7 failed, 5 passed, 12 total
Snapshots:   0 total
Time:        0.165 s, estimated 1 s
Ran all test suites.
```
Prompt:
Please fix the bugs in the code based on the details below:
The Employee Class maintains a hierarchical structure for employees, where each entry in the JSON object contains details such as `hoursWorked`, a `team` array list (each element in the array has same structure as the employee objects), `name`, and `empId`.

 Functions:

1.   `getAverageHoursWorked(employeeId)`
    
    -   This function accepts an employee ID and calculates the average hoursWorked ( Considering the hours worked by the employee and their team members.). If the employee has no team, it returns their own `hoursWorked`. The result is returned as an integer.
    -   If the `employeeId` is not a string, it throws the error "Invalid Input."
    -   If the employee ID doesn't exist, it throws the error "Employee is not present"

2.   `moveTeam(sourceEmployeeId, destinationEmployeeId)`
    -   This function takes two parameters: `sourceEmployeeId` and `destinationEmployeeId`. It moves the `team` members of `sourceEmployeeId` and appends them to the `destinationEmployeeId`'s team.
    -   If either `sourceEmployeeId` or `destinationEmployeeId` is not a string, it throws the error "Invalid Input."
    -   If either employee ID doesn't exist, it throws the error "Employee is not present"

4.   `getEmployeeData(empId)`
    
    -   This function searches for an employee recursively by `empId` and returns the corresponding JSON structure when a match is found.
    -   If no employee is found, it returns "Employee does not exist."

 Validation Rules while instantiating/creating employee:

-   `name` must be a string. If not, throw "Invalid Input"
-   `empId` must be a string. If not, throw "Invalid Input"
-   `hoursWorked` must be a number. If not, throw "Invalid Input"
-   Employee IDs must be unique. If duplicates are found, throw "Same Employee Id."


Note:
- Team members are always stored in sorted manner in ascending manner based on id.

Here are some of the test cases for which its failing along with the provided input employee hierarchy:
```javascript
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

 

  test("getAverageHoursWorked for a team", () => {
    const averageHours = vp1.getAverageHoursWorked("e2"); // Bob's team
    expect(averageHours).toBe(39); // (45 + 40 + 38 + 36) / 4 = 39
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
```