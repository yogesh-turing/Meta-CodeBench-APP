class Employee {
  constructor(name, empId, hoursWorked) {
      if (typeof name !== 'string') {
          throw new Error("Name must be a string");
      }
      if (typeof empId !== 'string') {
          throw new Error("Employee ID must be a string");
      }
      if (typeof hoursWorked !== 'number') {
          throw new Error("Hours worked must be a number");
      }

      this.name = name;
      this.empId = empId;
      this.hoursWorked = hoursWorked;
      this.team = [];
  }

  addTeamMember(employee) {
      if (this.getEmployeeData(employee.empId)) {
          throw new Error("Same Employee Id");
      }

      this.team.push(employee);
      this.team.sort((a, b) => a.empId.localeCompare(b.empId)); // Maintain sorted order
  }

  getEmployeeData(empId) {
      if (this.empId === empId) {
          return {
              empId: this.empId,
              name: this.name,
              hoursWorked: this.hoursWorked,
              team: this.team.map(member => member.getEmployeeData(member.empId)),
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

  getAverageHoursWorked(empId) {
      const employee = this.getEmployeeData(empId);
      if (!employee) {
          throw new Error("Employee does not exist");
      }

      let totalHours = employee.hoursWorked;
      let count = 1;

      const calculateTeamHours = (team) => {
          for (const member of team) {
              totalHours += member.hoursWorked;
              count++;
              if (member.team.length > 0) {
                  calculateTeamHours(member.team);
              }
          }
      };

      calculateTeamHours(employee.team);
      return Math.floor(totalHours / count);
  }

  moveTeam(sourceTeamEmployeeId, destinationTeamEmployeeId) {

      const sourceEmployee = this.getEmployeeData(sourceTeamEmployeeId);
      const destinationEmployee = this.getEmployeeData(destinationTeamEmployeeId);

      if (!sourceEmployee || !destinationEmployee) {
          throw new Error("Employee is not present");
      }

      // Helper function to find the employee object
      const findEmployee = (currentEmployee, empId) => {
          if (currentEmployee.empId === empId) {
              return currentEmployee;
          }
          for (const member of currentEmployee.team) {
              const result = findEmployee(member, empId);
              if (result) return result;
          }
          return null;
      };

      const sourceObj = findEmployee(this, sourceTeamEmployeeId);
      const destinationObj = findEmployee(this, destinationTeamEmployeeId);

      // Move team members to destination
      const teamToMove = sourceObj.team.splice(0); // Get and empty the source's team
      teamToMove.forEach(member => destinationObj.addTeamMember(member));
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