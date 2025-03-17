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

  toJSON() {
    return {
      empId: this.empId,
      name: this.name,
      hoursWorked: this.hoursWorked,
      team: this.team.map((member) => member.toJSON()),
    };
  }

  getTotalHoursAndMembers(employee) {
    let totalHours = employee.hoursWorked;
    let totalMembers = 1;

    const processTeam = (team) => {
      for (const member of team) {
        totalHours += member.hoursWorked;
        totalMembers++;
        if (member.team.length > 0) {
          processTeam(member.team);
        }
      }
    };

    processTeam(employee.team);
    return { totalHours, totalMembers };
  }

  getAverageHoursWorked(empId) {
    if (typeof empId !== "string") {
      throw new Error("Invalid Input");
    }

    const employee = this.getEmployeeData(empId);
    if (!employee) {
      throw new Error("Employee is not present");
    }

    const { totalHours, totalMembers } = this.getTotalHoursAndMembers(employee);
    return Math.floor(totalHours / totalMembers);
  }

  findParent(empId, current = this) {
    for (const member of current.team) {
      if (member.empId === empId) {
        return current;
      }
      const found = this.findParent(empId, member);
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

    const sourceParent = this.findParent(sourceTeamEmployeeId);
    if (sourceParent) {
      const sourceTeamMember = sourceParent.team.find(
        (member) => member.empId === sourceTeamEmployeeId
      );
      
      if (sourceTeamMember) {
        const teamToMove = [...sourceTeamMember.team];
        sourceTeamMember.team = [];
        
        const destinationTeamMember = this.findParent(destinationTeamEmployeeId)
          .team.find((member) => member.empId === destinationTeamEmployeeId);
        
        destinationTeamMember.team.push(sourceTeamMember);
        teamToMove.forEach(member => destinationTeamMember.team.push(member));
        destinationTeamMember.team.sort((a, b) => a.empId.localeCompare(b.empId));
      }
    }
  }
}

module.exports = { Employee };