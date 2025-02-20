class TeacherTransferManager {
  constructor() {
    this.departments = new Map();
    this.positionCache = new Map(); // Cache for quick position lookups
  }

  validateDepartment(department) {
    if (
      !department ||
      typeof department !== "string" ||
      !/^[a-zA-Z\s-]+$/.test(department)
    ) {
      throw new Error(
        "Invalid department identifier: Must contain only letters, spaces, and hyphens"
      );
    }
    return department.toLowerCase().trim();
  }

  validatePositionTitle(positionTitle) {
    if (
      !positionTitle ||
      typeof positionTitle !== "string" ||
      positionTitle.trim() === ""
    ) {
      throw new Error("Invalid position title: Title cannot be empty");
    }
    return positionTitle.trim();
  }

  validateCount(count) {
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error("Invalid position count: Must be a positive integer");
    }
    return count;
  }

  addPositions({ department, positionTitle, count }) {
    const validDepartment = this.validateDepartment(department);
    const validTitle = this.validatePositionTitle(positionTitle);
    const validCount = this.validateCount(count);

    if (!this.departments.has(validDepartment)) {
      this.departments.set(validDepartment, new Map());
    }

    const departmentPositions = this.departments.get(validDepartment);
    const currentCount = departmentPositions.get(validTitle)?.count || 0;
    departmentPositions.set(validTitle, {
      positionTitle: validTitle,
      count: currentCount + validCount,
    });

    // Update position cache
    const totalCount = (this.positionCache.get(validTitle) || 0) + validCount;
    this.positionCache.set(validTitle, totalCount);
  }

  totalPositions(positionTitle) {
    const validTitle = this.validatePositionTitle(positionTitle);
    const total = this.positionCache.get(validTitle) || 0;
    return total > 0 ? total : "Position not available";
  }

  transferTeacher({ department, positionTitle }) {
    const validDepartment = this.validateDepartment(department);
    const validTitle = this.validatePositionTitle(positionTitle);

    if (!this.departments.has(validDepartment)) {
      throw new Error(`Department not found: ${validDepartment}`);
    }

    const departmentPositions = this.departments.get(validDepartment);
    const position = departmentPositions.get(validTitle);

    if (!position) {
      return "Position not available";
    }

    if (position.count < 1) {
      throw new Error(
        `No available positions for ${validTitle} in ${validDepartment}`
      );
    }

    // Update department position count
    position.count--;
    departmentPositions.set(validTitle, position);

    // Update position cache
    const currentTotal = this.positionCache.get(validTitle);
    this.positionCache.set(validTitle, currentTotal - 1);

    return {
      department: validDepartment,
      positionTitle: validTitle,
      remainingPositions: position.count,
    };
  }

  departmentInventory(department) {
    const validDepartment = this.validateDepartment(department);

    if (!this.departments.has(validDepartment)) {
      return "Department not found";
    }

    const departmentPositions = this.departments.get(validDepartment);
    return Array.from(departmentPositions.values()).map((pos) => ({
      positionTitle: pos.positionTitle,
      available: pos.count,
    }));
  }

  clearDepartment(department) {
    const validDepartment = this.validateDepartment(department);

    if (this.departments.has(validDepartment)) {
      const departmentPositions = this.departments.get(validDepartment);

      // Update position cache
      for (const [title, position] of departmentPositions) {
        const currentTotal = this.positionCache.get(title);
        this.positionCache.set(title, currentTotal - position.count);
      }

      this.departments.delete(validDepartment);
      return true;
    }
    return false;
  }
}

module.exports = { TeacherTransferManager };
