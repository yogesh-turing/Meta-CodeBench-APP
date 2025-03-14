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
  
      const sumHours = (emp) =>
        emp.hoursWorked +
        emp.team.reduce((acc, member) => acc + sumHours(member), 0);
  
      const countMembers = (emp) =>
        1 + emp.team.reduce((acc, member) => acc + countMembers(member), 0);
  
      return Math.floor(sumHours(employee) / countMembers(employee));
    }
  
    moveTeam(sourceTeamEmployeeId, destinationTeamEmployeeId) {
      if (typeof sourceTeamEmployeeId !== "string" || typeof destinationTeamEmployeeId !== "string") {
        throw new Error("Invalid Input");
      }
      const sourceEmployeeData = this.getEmployeeData(sourceTeamEmployeeId);
      if (!sourceEmployeeData) {
        throw new Error("Employee is not present");
      }
  
      const destinationEmployee = this.getEmployeeData(destinationTeamEmployeeId);
      if (!destinationEmployee) {
        throw new Error("Employee is not present");
      }
  
      this.team = this.team.filter((member) => member.empId !== sourceTeamEmployeeId);
      destinationEmployee.team.push(sourceEmployeeData);
      destinationEmployee.team.sort((a, b) => a.empId.localeCompare(b.empId));
    }
  }
  
  module.exports = { Employee };