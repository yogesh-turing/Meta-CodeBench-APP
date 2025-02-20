class TeacherTransferManager {
  constructor() {
    this.departments = {};
  }

  /**
   * Add positions to a department.
   * @param {Object} options
   * @param {string} options.department - Department name.
   * @param {string} options.positionTitle - Position title.
   * @param {number} options.count - Number of positions.
   */
  addPositions({ department, positionTitle, count }) {
    // Validate input
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

    // Normalize department name
    department = department.toLowerCase();

    // Create department if it doesn't exist
    if (!this.departments[department]) {
      this.departments[department] = {};
    }

    // Add or update position count
    if (this.departments[department][positionTitle]) {
      this.departments[department][positionTitle] += count;
    } else {
      this.departments[department][positionTitle] = count;
    }
  }

  /**
   * Get total positions for a given position title.
   * @param {string} positionTitle - Position title.
   * @returns {number|string} Total positions or "Position not available" if not found.
   */
  totalPositions(positionTitle) {
    // Validate input
    if (
      !positionTitle ||
      typeof positionTitle !== "string" ||
      positionTitle.trim() === ""
    ) {
      throw new Error("Invalid position title");
    }

    // Initialize total count
    let total = 0;

    // Iterate over departments and positions
    for (let department in this.departments) {
      if (this.departments[department][positionTitle]) {
        total += this.departments[department][positionTitle];
      }
    }

    // Return total count or "Position not available" if zero
    return total > 0 ? total : "Position not available";
  }

  /**
   * Transfer a teacher to a department.
   * @param {Object} options
   * @param {string} options.department - Department name.
   * @param {string} options.positionTitle - Position title.
   */
  transferTeacher({ department, positionTitle }) {
    // Validate input
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

    // Normalize department name
    department = department.toLowerCase();

    // Check if department exists
    if (!this.departments[department]) {
      throw new Error("Department not found");
    }

    // Check if position exists in department
    if (!this.departments[department][positionTitle]) {
      return "Position not available";
    }

    // Decrement position count
    if (this.departments[department][positionTitle] < 1) {
      throw new Error("No available positions in this department");
    }
    this.departments[department][positionTitle]--;
  }

  /**
   * Get department inventory.
   * @param {string} department - Department name.
   * @returns {Object[]|string} Department inventory or "Department not found" if not found.
   */
  departmentInventory(department) {
    // Validate input
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    ) {
      throw new Error("Invalid department identifier");
    }

    // Normalize department name
    department = department.toLowerCase();

    // Check if department exists
    if (!this.departments[department]) {
      return "Department not found";
    }

    // Return department inventory
    return Object.keys(this.departments[department]).map((positionTitle) => ({
      positionTitle,
      available: this.departments[department][positionTitle],
    }));
  }
}

module.exports = { TeacherTransferManager };
