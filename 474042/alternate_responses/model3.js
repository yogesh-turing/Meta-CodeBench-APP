class TeacherTransferManager {
  constructor() {
    this.departments = new Map();
  }

  validateInput(department, positionTitle, count = null) {
    if (!department?.trim()) {
      throw new Error("Invalid department identifier");
    }
    if (!positionTitle?.trim()) {
      throw new Error("Invalid position title");
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
      throw new Error("Invalid position title");
    }

    let total = 0;
    positionTitle = positionTitle.trim();

    for (const departmentPositions of this.departments.values()) {
      const count = departmentPositions.get(positionTitle) || 0;
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
      inventory.push({
        positionTitle,
        available: count,
      });
    }

    return inventory;
  }

  getDepartmentStats(department) {
    const validated = this.validateInput(department, "dummy");

    if (!this.departments.has(validated.department)) {
      return {
        totalPositions: 0,
        uniqueRoles: 0,
        status: "Department not found",
      };
    }

    const departmentPositions = this.departments.get(validated.department);
    let totalPositions = 0;

    for (const count of departmentPositions.values()) {
      totalPositions += count;
    }

    return {
      totalPositions,
      uniqueRoles: departmentPositions.size,
      status: "active",
    };
  }
}

module.exports = { TeacherTransferManager };
