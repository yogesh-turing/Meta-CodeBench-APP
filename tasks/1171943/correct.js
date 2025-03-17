class Employee {
  constructor(name, empId, hoursWorked) {
    if (typeof name !== "string") {
      throw new Error("Invalid Input");
    }
    if (typeof empId !== "string") {
      throw new Error("Invalid Input");
    }
    if (typeof hoursWorked !== "number") {
      throw new Error("Invalid Input");
    }

    this.name = name;
    this.empId = empId;
    this.hoursWorked = hoursWorked;
    this.team = [];
  }

  addTeamMember(employee) {
    if (this.team.find((member) => member.empId === employee.empId)) {
      throw new Error("Same Employee Id");
    }
    this.team.push(employee);
    this.team.sort((a, b) => a.empId.localeCompare(b.empId));
  }

  getEmployeeData(empId) {
    if (this.empId === empId) {
      return {
        empId: this.empId,
        name: this.name,
        hoursWorked: this.hoursWorked,
        team: this.team.map((member) => member.getEmployeeData(member.empId)),
      };
    }

    for (const member of this.team) {
      const data = member.getEmployeeData(empId);
      if (data) {
        return data;
      }
    }

    return null;
  }

  findEmployeeById(empId) {
    if (this.empId === empId) return this;
    for (const member of this.team) {
      const found = member.findEmployeeById(empId);
      if (found) return found;
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
    const employee = this.findEmployeeById(empId);
    if (!employee) {
      throw new Error("Employee is not present");
    }

    let totalHours = employee.hoursWorked;
    let count = 1;

    const calculateTeamHours = (team) => {
      for (const member of team) {
        totalHours += member.hoursWorked;
        count++;
        if (member.team.length > 0) {
          calculateTeamHours(member.team);
        }
      }
    };

    if (employee.team.length > 0) {
      calculateTeamHours(employee.team);
      return Math.floor(totalHours / count);
    }

    return employee.hoursWorked;
  }

  moveTeam(sourceTeamEmployeeId, destinationTeamEmployeeId) {
    const sourceEmployee = this.getEmployeeData(sourceTeamEmployeeId);
    const destinationEmployee = this.getEmployeeData(destinationTeamEmployeeId);

    if (!sourceEmployee || !destinationEmployee) {
      throw new Error("Employee is not present");
    }

    // Helper function to get actual employee object
    const findEmployeeObject = (currentEmployee, targetId) => {
      if (currentEmployee.empId === targetId) {
        return currentEmployee;
      }
      for (const member of currentEmployee.team) {
        const result = findEmployeeObject(member, targetId);
        if (result) return result;
      }
    };

    const sourceObj = findEmployeeObject(this, sourceTeamEmployeeId);
    const destinationObj = findEmployeeObject(this, destinationTeamEmployeeId);

    // Move team members to destination
    const teamToMove = [...sourceObj.team];
    sourceObj.team = [];

    for (const member of teamToMove) {
      destinationObj.addTeamMember(member);
    }
  }
}

module.exports = { Employee };