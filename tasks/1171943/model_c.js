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
  
    calculateTotalHoursAndMembers(employeeData) {
      let totalHours = employeeData.hoursWorked;
      let totalMembers = 1;
  
      for (const member of employeeData.team) {
        totalHours += member.hoursWorked;
        totalMembers += 1;
      }
  
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
  
      const { totalHours, totalMembers } = this.calculateTotalHoursAndMembers(employee);
      return Math.floor(totalHours / totalMembers);
    }
  
    findAndRemoveEmployee(empId, parent = null) {
      if (this.empId === empId) {
        return { employee: this, parent };
      }
  
      for (let i = 0; i < this.team.length; i++) {
        const result = this.team[i].findAndRemoveEmployee(empId, this);
        if (result) {
          return result;
        }
      }
  
      return null;
    }
  
    moveTeam(sourceTeamEmployeeId, destinationTeamEmployeeId) {
      if (typeof sourceTeamEmployeeId !== "string" || typeof destinationTeamEmployeeId !== "string") {
        throw new Error("Invalid Input");
      }
  
      const sourceResult = this.findAndRemoveEmployee(sourceTeamEmployeeId);
      if (!sourceResult) {
        throw new Error("Employee is not present");
      }
  
      const destinationEmployee = this.getEmployeeData(destinationTeamEmployeeId);
      if (!destinationEmployee) {
        throw new Error("Employee is not present");
      }
  
      const { employee: sourceEmployee, parent: sourceParent } = sourceResult;
  
      if (sourceParent) {
        sourceParent.team = sourceParent.team.filter(
          (member) => member.empId !== sourceTeamEmployeeId
        );
      }
  
      const sourceTeamMembers = [...sourceEmployee.team];
      sourceEmployee.team = [];
  
      const destEmployee = this.findAndRemoveEmployee(destinationTeamEmployeeId).employee;
      destEmployee.addTeamMember(sourceEmployee);
  
      for (const member of sourceTeamMembers) {
        destEmployee.addTeamMember(member);
      }
  
      destEmployee.team.sort((a, b) => a.empId.localeCompare(b.empId));
    }
  }
  
  module.exports = { Employee };