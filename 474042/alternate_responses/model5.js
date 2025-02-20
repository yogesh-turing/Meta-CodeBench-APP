class TeacherTransferManager {
  constructor() {
    this.departments = new Map();
    this.positionCache = new Map(); // Cache for quick position lookups
  }

  validateInput(department, positionTitle, count = null) {
    if (!department?.trim()) {
      throw new Error("Department identifier cannot be empty or invalid");
    }
    if (!positionTitle?.trim()) {
      throw new Error("Position title cannot be empty or invalid");
    }
    if (count !== null && (!Number.isInteger(count) || count <= 0)) {
      throw new Error("Position count must be a positive integer");
    }
  }

  addPositions({ department, positionTitle, count }) {
    this.validateInput(department, positionTitle, count);

    const deptKey = department.toLowerCase();
    if (!this.departments.has(deptKey)) {
      this.departments.set(deptKey, new Map());
    }

    const departmentPositions = this.departments.get(deptKey);
    const currentCount = departmentPositions.get(positionTitle) || 0;
    departmentPositions.set(positionTitle, currentCount + count);

    // Update position cache
    const totalCount = (this.positionCache.get(positionTitle) || 0) + count;
    this.positionCache.set(positionTitle, totalCount);

    return true;
  }

  totalPositions(positionTitle) {
    this.validateInput("dummy", positionTitle);

    const count = this.positionCache.get(positionTitle) || 0;
    return count > 0 ? count : "Position not available";
  }

  transferTeacher({ department, positionTitle }) {
    this.validateInput(department, positionTitle);

    const deptKey = department.toLowerCase();
    if (!this.departments.has(deptKey)) {
      throw new Error(`Department '${department}' not found`);
    }

    const departmentPositions = this.departments.get(deptKey);
    const currentCount = departmentPositions.get(positionTitle);

    if (!currentCount) {
      return "Position not available";
    }

    if (currentCount < 1) {
      throw new Error(
        `No available positions for '${positionTitle}' in ${department}`
      );
    }

    // Update department count
    departmentPositions.set(positionTitle, currentCount - 1);

    // Update position cache
    const totalCount = this.positionCache.get(positionTitle);
    this.positionCache.set(positionTitle, totalCount - 1);

    return true;
  }

  departmentInventory(department) {
    this.validateInput(department, "dummy");

    const deptKey = department.toLowerCase();
    if (!this.departments.has(deptKey)) {
      return "Department not found";
    }

    const departmentPositions = this.departments.get(deptKey);
    const inventory = [];

    for (const [positionTitle, count] of departmentPositions) {
      if (count > 0) {
        inventory.push({
          positionTitle,
          available: count,
        });
      }
    }

    return inventory;
  }

  getDepartmentStats(department) {
    this.validateInput(department, "dummy");

    const deptKey = department.toLowerCase();
    if (!this.departments.has(deptKey)) {
      return {
        totalPositions: 0,
        uniqueRoles: 0,
        status: "Department not found",
      };
    }

    const departmentPositions = this.departments.get(deptKey);
    let totalPositions = 0;
    const uniqueRoles = new Set();

    for (const [position, count] of departmentPositions) {
      if (count > 0) {
        totalPositions += count;
        uniqueRoles.add(position);
      }
    }

    return {
      totalPositions,
      uniqueRoles: uniqueRoles.size,
      status: "Active",
    };
  }
}

module.exports = { TeacherTransferManager };
