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
    bedType = bedType.toLowerCase();

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
        if (bed.bedType === bedType.toLowerCase()) {
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
    bedType = bedType.toLowerCase();

    let found = false;

    if (!this.departments[department]) throw "Department not found";

    for (let bed of this.departments[department]) {
      if (bed.bedType === bedType) {
        found = true;
        if (bed.count < 1) throw "No available beds in this department";
        bed.count--;
        break;
      }
    }

    if (!found) throw "Bed type not available";
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
