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
      this.sortTeam();
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
      throw new Error("Employee does not exist");
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
      const totalHours =
        employee.hoursWorked +
        employee.team.reduce((acc, member) => acc + member.hoursWorked, 0);
      const totalMembers = employee.team.length + 1;
      return Math.floor(totalHours / totalMembers);
    }
  
    moveTeam(sourceEmployeeId, destinationEmployeeId) {
      if (typeof sourceEmployeeId !== "string" || typeof destinationEmployeeId !== "string") {
        throw new Error("Invalid Input");
      }
      const sourceEmployee = this.getEmployeeData(sourceEmployeeId);
      const destinationEmployee = this.getEmployeeData(destinationEmployeeId);
      if (!sourceEmployee || !destinationEmployee) {
        throw new Error("Employee is not present");
      }
      this.team = this.team.filter((member) => member.empId !== sourceEmployeeId);
      destinationEmployee.team.push(sourceEmployee);
      destinationEmployee.sortTeam();
    }
  
    sortTeam() {
      this.team.sort((a, b) => a.empId.localeCompare(b.empId));
    }
  }
  
  module.exports = { Employee };