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
    if (!this.departments[department]) {
      this.departments[department] = [];
    }

    const existingBed = this.departments[department].find(
      (bed) => bed.bedType === bedType
    );
    if (existingBed) {
      existingBed.count += count;
    } else {
      this.departments[department].push({ bedType, count });
    }
  }

  totalBeds(bedType) {
    if (!bedType || typeof bedType !== "string" || bedType.trim() === "")
      throw "Invalid bed type";

    let total = 0;

    for (let department in this.departments) {
      for (let bed of this.departments[department]) {
        if (bed.bedType === bedType) {
          total += bed.count;
        }
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
    let found = false;

    for (let dept in this.departments) {
      this.departments[dept] = this.departments[dept].map((bed) => {
        if (bed.bedType === bedType && dept === department) {
          found = true;
          if (bed.count < 1) throw "No available beds in this department";
          return { ...bed, count: bed.count - 1 };
        }
        return bed;
      });
    }

    if (!found) return "Bed type not available";
  }

  departmentInventory(department) {
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    )
      throw "Invalid department identifier";

    department = department.toLowerCase();

    if (!this.departments[department]) return "Department not found";

    return this.departments[department];
  }
}

module.exports = { HospitalBedManager };
