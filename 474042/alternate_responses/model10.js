class TeacherTransferManager {
  constructor() {
    this.departments = {};
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
    if (!this.departments[department]) {
      this.departments[department] = {};
    }

    if (this.departments[department][positionTitle]) {
      this.departments[department][positionTitle] += count;
    } else {
      this.departments[department][positionTitle] = count;
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
    for (let department in this.departments) {
      if (this.departments[department][positionTitle]) {
        total += this.departments[department][positionTitle];
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
    if (!this.departments[department]) {
      throw new Error("Department not found");
    }

    if (
      !this.departments[department][positionTitle] ||
      this.departments[department][positionTitle] < 1
    ) {
      throw new Error("No available positions in this department");
    }

    this.departments[department][positionTitle]--;
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
    if (!this.departments[department]) {
      return "Department not found";
    }

    let inventory = [];
    for (let positionTitle in this.departments[department]) {
      inventory.push({
        positionTitle,
        available: this.departments[department][positionTitle],
      });
    }

    return inventory;
  }
}

module.exports = { TeacherTransferManager };
