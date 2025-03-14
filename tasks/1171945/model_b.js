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
  
      const { totalHours, totalMembers } = this.getTotalHoursAndMembers({
        hoursWorked: employee.hoursWorked,
        team: employee.team,
      });
  
      return Math.floor(totalHours / totalMembers);
    }
  
    findAndRemove(empId, team) {
      const index = team.findIndex((member) => member.empId === empId);
      if (index !== -1) {
        return team.splice(index, 1)[0];
      }
  
      for (const member of team) {
        const found = this.findAndRemove(empId, member.team);
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
  
      const removedEmployee = this.findAndRemove(sourceTeamEmployeeId, this.team);
      if (removedEmployee) {
        const destination = this.findAndRemove(destinationTeamEmployeeId, this.team);
        destination.team = [...destination.team, removedEmployee];
        destination.team.sort((a, b) => a.empId.localeCompare(b.empId));
        this.team.push(destination);
        this.team.sort((a, b) => a.empId.localeCompare(b.empId));
      }
    }
  }
  
  module.exports = { Employee };