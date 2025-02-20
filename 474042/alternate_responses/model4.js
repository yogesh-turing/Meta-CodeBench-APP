class TeacherTransferManager {
  constructor() {
    this.departments = new Map();
    this.positionCache = new Map(); // Cache for quick position lookups
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
  }

  normalizeDepartment(department) {
    return department.trim().toLowerCase();
  }

  addPositions({ department, positionTitle, count }) {
    this.validateInput(department, positionTitle, count);

    const normalizedDept = this.normalizeDepartment(department);
    positionTitle = positionTitle.trim();

    if (!this.departments.has(normalizedDept)) {
      this.departments.set(normalizedDept, new Map());
    }

    const deptPositions = this.departments.get(normalizedDept);
    const currentCount = deptPositions.get(positionTitle)?.count || 0;
    deptPositions.set(positionTitle, {
      positionTitle,
      count: currentCount + count,
    });

    // Update position cache
    const totalCount = (this.positionCache.get(positionTitle) || 0) + count;
    this.positionCache.set(positionTitle, totalCount);
  }

  totalPositions(positionTitle) {
    this.validateInput("dummy", positionTitle);
    positionTitle = positionTitle.trim();

    const cachedCount = this.positionCache.get(positionTitle);
    return cachedCount > 0 ? cachedCount : "Position not available";
  }

  transferTeacher({ department, positionTitle }) {
    this.validateInput(department, positionTitle);

    const normalizedDept = this.normalizeDepartment(department);
    positionTitle = positionTitle.trim();

    if (!this.departments.has(normalizedDept)) {
      throw new Error(`Department '${department}' not found`);
    }

    const deptPositions = this.departments.get(normalizedDept);
    const position = deptPositions.get(positionTitle);

    if (!position || position.count < 1) {
      return "Position not available";
    }

    // Update position count
    position.count--;
    deptPositions.set(positionTitle, position);

    // Update cache
    const cachedCount = this.positionCache.get(positionTitle);
    this.positionCache.set(positionTitle, cachedCount - 1);

    // Clean up if count reaches 0
    if (position.count === 0) {
      deptPositions.delete(positionTitle);
      if (deptPositions.size === 0) {
        this.departments.delete(normalizedDept);
      }
    }

    return true;
  }

  departmentInventory(department) {
    this.validateInput(department, "dummy");

    const normalizedDept = this.normalizeDepartment(department);

    if (!this.departments.has(normalizedDept)) {
      return "Department not found";
    }

    const deptPositions = this.departments.get(normalizedDept);
    return Array.from(deptPositions.values()).map((pos) => ({
      positionTitle: pos.positionTitle,
      available: pos.count,
    }));
  }

  getDepartmentStats(department) {
    this.validateInput(department, "dummy");

    const normalizedDept = this.normalizeDepartment(department);

    if (!this.departments.has(normalizedDept)) {
      return {
        totalPositions: 0,
        uniquePositions: 0,
        departmentExists: false,
      };
    }

    const deptPositions = this.departments.get(normalizedDept);
    const positions = Array.from(deptPositions.values());

    return {
      totalPositions: positions.reduce((sum, pos) => sum + pos.count, 0),
      uniquePositions: positions.length,
      departmentExists: true,
    };
  }
}

module.exports = { TeacherTransferManager };
