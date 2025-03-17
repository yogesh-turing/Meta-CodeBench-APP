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