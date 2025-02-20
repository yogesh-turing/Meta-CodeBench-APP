class Employee {
  constructor(name, empId, hoursWorked) {
      this.name = name;
      this.empId = empId;
      this.hoursWorked = hoursWorked;
      this.team = []; // Array to hold subordinates (team members)
  }

  addTeamMember(employee) {
      this.team.push(employee);
  }

  getEmployeeData(empId) {
      // Check if this employee matches the ID
      if (this.empId === empId) {
          return {
              empId: this.empId,
              name: this.name,
              hoursWorked: this.hoursWorked,
              team: this.team.map(member => member.getEmployeeData(member.empId)),
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
          team: this.team.map(member => member.toJSON()),
      };
  }
}

module.exports = { Employee };