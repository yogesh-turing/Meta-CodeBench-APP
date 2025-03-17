class Employee {
    constructor(name, empId, hoursWorked) {
      if (typeof name !== "string" || typeof empId !== "string" || typeof hoursWorked !== "number") {
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
  
      return "Employee does not exist";
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
      if (employee === "Employee does not exist") {
        throw new Error("Employee is not present");
      }
  
      const totalHours =
        employee.hoursWorked +
        employee.team.reduce((acc, member) => acc + member.hoursWorked, 0);
      const totalMembers = employee.team.length + 1;
      return Math.floor(totalHours / totalMembers);
    }
  
    moveTeam(sourceTeamEmployeeId, destinationTeamEmployeeId) {
      if (typeof sourceTeamEmployeeId !== "string" || typeof destinationTeamEmployeeId !== "string") {
        throw new Error("Invalid Input");
      }
  
      const sourceEmployee = this.getEmployeeData(sourceTeamEmployeeId);
      if (sourceEmployee === "Employee does not exist") {
        throw new Error("Employee is not present");
      }
  
      const destinationEmployee = this.getEmployeeData(destinationTeamEmployeeId);
      if (destinationEmployee === "Employee does not exist") {
        throw new Error("Employee is not present");
      }
  
      const sourceTeamIndex = this.team.findIndex(
        (member) => member.empId === sourceTeamEmployeeId
      );
      if (sourceTeamIndex !== -1) {
        this.team.splice(sourceTeamIndex, 1);
      }
  
      destinationEmployee.team.push(sourceEmployee);
      destinationEmployee.team.sort((a, b) => a.empId.localeCompare(b.empId));
    }
  }
  
  module.exports = { Employee };