class TeacherTransferManager {
  constructor() {
    this.departments = new Map();
  }

  validateInput(department, positionTitle, count = null) {
    if (!department?.trim()) {
      throw new Error("Department name cannot be empty or invalid");
    }
    if (!positionTitle?.trim()) {
      throw new Error("Position title cannot be empty or invalid");
    }
    if (count !== null && (!Number.isInteger(count) || count <= 0)) {
      throw new Error("Position count must be a positive integer");
    }
    return {
      department: department.toLowerCase().trim(),
      positionTitle: positionTitle.trim(),
    };
  }

  addPositions({ department, positionTitle, count }) {
    const validated = this.validateInput(department, positionTitle, count);

    if (!this.departments.has(validated.department)) {
      this.departments.set(validated.department, new Map());
    }

    const departmentPositions = this.departments.get(validated.department);
    const currentCount = departmentPositions.get(validated.positionTitle) || 0;
    departmentPositions.set(validated.positionTitle, currentCount + count);
  }

  totalPositions(positionTitle) {
    if (!positionTitle?.trim()) {
      throw new Error("Position title cannot be empty or invalid");
    }

    let total = 0;
    for (const departmentPositions of this.departments.values()) {
      const count = departmentPositions.get(positionTitle.trim()) || 0;
      total += count;
    }

    return total > 0 ? total : "Position not available";
  }

  transferTeacher({ department, positionTitle }) {
    const validated = this.validateInput(department, positionTitle);

    if (!this.departments.has(validated.department)) {
      throw new Error("Department not found");
    }

    const departmentPositions = this.departments.get(validated.department);
    const currentCount = departmentPositions.get(validated.positionTitle);

    if (!currentCount) {
      return "Position not available";
    }

    if (currentCount < 1) {
      throw new Error("No available positions in this department");
    }

    departmentPositions.set(validated.positionTitle, currentCount - 1);
    return true;
  }

  departmentInventory(department) {
    const validated = this.validateInput(department, "dummy");

    if (!this.departments.has(validated.department)) {
      return "Department not found";
    }

    const departmentPositions = this.departments.get(validated.department);
    const inventory = [];

    for (const [positionTitle, count] of departmentPositions.entries()) {
      if (count > 0) {
        inventory.push({
          positionTitle,
          available: count,
        });
      }
    }

    return inventory;
  }

  getDepartmentsList() {
    return Array.from(this.departments.keys());
  }

  clearDepartment(department) {
    const validated = this.validateInput(department, "dummy");
    return this.departments.delete(validated.department);
  }
}

module.exports = { TeacherTransferManager };
