class TeacherTransferManager {
  constructor() {
    this.departments = new Map();
  }

  addPositions({ department, positionTitle, count }) {
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    ) {
      throw new Error("Invalid department identifier");
    }
    if (
      !positionTitle ||
      typeof positionTitle !== "string" ||
      positionTitle.trim() === ""
    ) {
      throw new Error("Invalid position title");
    }
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error("Invalid position count");
    }

    department = department.toLowerCase();
    if (!this.departments.has(department)) {
      this.departments.set(department, new Map());
    }

    const departmentPositions = this.departments.get(department);
    if (departmentPositions.has(positionTitle)) {
      const existingCount = departmentPositions.get(positionTitle);
      departmentPositions.set(positionTitle, existingCount + count);
    } else {
      departmentPositions.set(positionTitle, count);
    }
  }

  totalPositions(positionTitle) {
    if (
      !positionTitle ||
      typeof positionTitle !== "string" ||
      positionTitle.trim() === ""
    ) {
      throw new Error("Invalid position title");
    }

    let total = 0;
    for (const departmentPositions of this.departments.values()) {
      if (departmentPositions.has(positionTitle)) {
        total += departmentPositions.get(positionTitle);
      }
    }

    return total > 0 ? total : "Position not available";
  }

  transferTeacher({ department, positionTitle }) {
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    ) {
      throw new Error("Invalid department identifier");
    }
    if (
      !positionTitle ||
      typeof positionTitle !== "string" ||
      positionTitle.trim() === ""
    ) {
      throw new Error("Invalid position title");
    }

    department = department.toLowerCase();
    if (!this.departments.has(department)) {
      throw new Error("Department not found");
    }

    const departmentPositions = this.departments.get(department);
    if (!departmentPositions.has(positionTitle)) {
      return "Position not available";
    }

    const currentCount = departmentPositions.get(positionTitle);
    if (currentCount < 1) {
      throw new Error("No available positions in this department");
    }

    departmentPositions.set(positionTitle, currentCount - 1);
  }

  departmentInventory(department) {
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    ) {
      throw new Error("Invalid department identifier");
    }

    department = department.toLowerCase();
    if (!this.departments.has(department)) {
      return "Department not found";
    }

    const departmentPositions = this.departments.get(department);
    const inventory = [];
    for (const [positionTitle, count] of departmentPositions) {
      inventory.push({ positionTitle, available: count });
    }

    return inventory;
  }
}

module.exports = { TeacherTransferManager };
