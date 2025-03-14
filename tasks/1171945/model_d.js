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
  
    findEmployeeById(empId) {
      if (this.empId === empId) return this;
      for (const member of this.team) {
        const found = member.findEmployeeById(empId);
        if (found) return found;
      }
      return null;
    }
  
    getAverageHoursWorked(empId) {
      if (typeof empId !== "string") {
        throw new Error("Invalid Input");
      }
  
      const employee = this.findEmployeeById(empId);
      if (!employee) {
        throw new Error("Employee is not present");
      }
  
      const getAllTeamHours = (emp) => {
        let total = emp.hoursWorked;
        let count = 1;
        for (const member of emp.team) {
          total += member.hoursWorked;
          count++;
        }
        return { total, count };
      };
  
      const { total, count } = getAllTeamHours(employee);
      return Math.floor(total / count);
    }
  
    moveTeam(sourceTeamEmployeeId, destinationTeamEmployeeId) {
      if (typeof sourceTeamEmployeeId !== "string" || typeof destinationTeamEmployeeId !== "string") {
        throw new Error("Invalid Input");
      }
  
      const sourceEmployee = this.findEmployeeById(sourceTeamEmployeeId);
      if (!sourceEmployee) {
        throw new Error("Employee is not present");
      }
  
      const destinationEmployee = this.findEmployeeById(destinationTeamEmployeeId);
      if (!destinationEmployee) {
        throw new Error("Employee is not present");
      }
  
      const findParent = (currentEmp, targetId) => {
        for (const member of currentEmp.team) {
          if (member.empId === targetId) return currentEmp;
          const found = findParent(member, targetId);
          if (found) return found;
        }
        return null;
      };
  
      const sourceParent = findParent(this, sourceTeamEmployeeId);
      if (sourceParent) {
        const sourceTeamMembers = [...sourceEmployee.team];
        sourceEmployee.team = [];
        sourceParent.team = sourceParent.team.filter(member => member.empId !== sourceTeamEmployeeId);
        destinationEmployee.team.push(...sourceTeamMembers);
        destinationEmployee.team.sort((a, b) => a.empId.localeCompare(b.empId));
      }
    }
  }
  
  module.exports = { Employee };