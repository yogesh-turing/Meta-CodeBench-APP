class HospitalBedManager {
  constructor() {
    this.departments = {};
  }

  addBeds({ department, bedType, count }) {
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    )
      throw "Invalid department identifier";
    if (!bedType || typeof bedType !== "string" || bedType.trim() === "")
      throw "Invalid bed type";
    if (!Number.isInteger(count) || count <= 0) throw "Invalid bed count";

    department = department.toLowerCase();
    bedType = bedType.trim();

    if (!this.departments[department]) {
      this.departments[department] = [];
    }

    // Check if bed type already exists in department
    const existingBedIndex = this.departments[department].findIndex(
      (bed) => bed.bedType === bedType
    );

    if (existingBedIndex >= 0) {
      // Update existing bed count
      this.departments[department][existingBedIndex].count += count;
    } else {
      // Add new bed type
      this.departments[department].push({ bedType, count });
    }
  }

  totalBeds(bedType) {
    if (!bedType || typeof bedType !== "string" || bedType.trim() === "")
      throw "Invalid bed type";

    bedType = bedType.trim();
    let total = 0;

    for (let department in this.departments) {
      const bedInfo = this.departments[department].find(
        (bed) => bed.bedType === bedType
      );
      if (bedInfo) {
        total += bedInfo.count;
      }
    }

    return total > 0 ? total : "Bed type not available";
  }

  admitPatient({ department, bedType }) {
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    )
      throw "Invalid department identifier";
    if (!bedType || typeof bedType !== "string" || bedType.trim() === "")
      throw "Invalid bed type";

    department = department.toLowerCase();
    bedType = bedType.trim();

    if (!this.departments[department]) {
      throw "Department not found";
    }

    const bedIndex = this.departments[department].findIndex(
      (bed) => bed.bedType === bedType
    );

    if (bedIndex === -1) {
      return "Bed type not available";
    }

    if (this.departments[department][bedIndex].count < 1) {
      throw "No available beds in this department";
    }

    this.departments[department][bedIndex].count--;
    return "Patient admitted successfully";
  }

  departmentInventory(department) {
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    )
      throw "Invalid department identifier";

    department = department.toLowerCase();

    if (!this.departments[department]) {
      return "Department not found";
    }

    return this.departments[department].map((bed) => ({
      bedType: bed.bedType,
      count: bed.count,
    }));
  }
}

module.exports = { HospitalBedManager };
