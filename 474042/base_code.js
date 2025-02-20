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
      this.departments[department] = [];
    }

    let existingPosition = this.departments[department].find(
      (pos) => pos.positionTitle === positionTitle
    );
    if (existingPosition) {
      existingPosition.count += count;
    } else {
      this.departments[department].push({ positionTitle, count });
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
      for (let pos of this.departments[department]) {
        if (pos.positionTitle === positionTitle) {
          total += pos.count;
        }
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

    let found = false;
    this.departments[department] = this.departments[department].map((pos) => {
      if (pos.positionTitle === positionTitle) {
        found = true;
        if (pos.count < 1)
          throw new Error("No available positions in this department");
        return { ...pos, count: pos.count - 1 };
      }
      return pos;
    });

    if (!found) {
      return "Position not available";
    }
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

    return this.departments[department].map((pos) => ({
      positionTitle: pos.positionTitle,
      available: pos.count,
    }));
  }
}

module.exports = { TeacherTransferManager };
