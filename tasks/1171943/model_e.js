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
        team: this.team.map((member) => member.toJSON()),
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

  toJSON() {
    return {
      empId: this.empId,
      name: this.name,
      hoursWorked: this.hoursWorked,
      team: this.team.map((member) => member.toJSON()),
    };
  }

  getAverageHoursWorked(empId) {
    if (typeof empId !== "string") {
      throw new Error("Invalid Input");
    }

    const employee = this.getEmployeeData(empId);
    if (!employee) {
      throw new Error("Employee is not present");
    }

    let totalHours = employee.hoursWorked;
    let totalMembers = 1;

    const calculateTeamHours = (team) => {
      for (const member of team) {
        totalHours += member.hoursWorked;
        totalMembers++;
      }
    };

    calculateTeamHours(employee.team);
    return Math.floor(totalHours / totalMembers);
  }

  findAndRemoveEmployee(empId) {
    const index = this.team.findIndex(member => member.empId === empId);
    if (index !== -1) {
      return this.team.splice(index, 1)[0];
    }
    
    for (const member of this.team) {
      const found = member.findAndRemoveEmployee(empId);
      if (found) return found;
    }
    return null;
  }

  moveTeam(sourceTeamEmployeeId, destinationTeamEmployeeId) {
    if (typeof sourceTeamEmployeeId !== "string" || typeof destinationTeamEmployeeId !== "string") {
      throw new Error("Invalid Input");
    }

    const sourceEmployee = this.getEmployeeData(sourceTeamEmployeeId);
    if (!sourceEmployee) {
      throw new Error("Employee is not present");
    }

    const destinationEmployee = this.getEmployeeData(destinationTeamEmployeeId);
    if (!destinationEmployee) {
      throw new Error("Employee is not present");
    }

    const removedEmployee = this.findAndRemoveEmployee(sourceTeamEmployeeId);
    if (removedEmployee) {
      const destEmployee = this.findAndRemoveEmployee(destinationTeamEmployeeId);
      if (destEmployee) {
        removedEmployee.team.forEach(member => {
          destEmployee.addTeamMember(member);
        });
        removedEmployee.team = [];
        destEmployee.addTeamMember(removedEmployee);
        this.addTeamMember(destEmployee);
      }
    }
  }
}

module.exports = { Employee };