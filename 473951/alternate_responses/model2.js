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

    bedType = bedType.toLowerCase();
    let total = 0;

    for (let department in this.departments) {
      const beds = this.departments[department];
      const matchingBed = beds.find((bed) => bed.bedType === bedType);
      if (matchingBed) {
        total += matchingBed.count;
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

    if (!this.departments[department]) throw "Department not found";

    const departmentBeds = this.departments[department];
    const bedIndex = departmentBeds.findIndex((bed) => bed.bedType === bedType);

    if (bedIndex === -1) return "Bed type not available";

    if (departmentBeds[bedIndex].count < 1)
      throw "No available beds in this department";

    departmentBeds[bedIndex].count--;
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

    if (!this.departments[department]) return "Department not found";

    return this.departments[department].map((bed) => ({
      bedType: bed.bedType,
      count: bed.count,
    }));
  }
}

module.exports = { HospitalBedManager };
