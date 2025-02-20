//hospitalBedManagerjs
class HospitalBedManager {
  constructor() {
    /**
     * Initializes an empty object to store department-wise bed data.
     * @property {Object} departments - Stores department-wise bed details.
     */
    this.departments = {};
  }

  /**
   * Adds a specified number of beds to a department.
   * @param {Object} params - The parameters for adding beds.
   * @param {string} params.department - The department name.
   * @param {string} params.bedType - The type of bed to add.
   * @param {number} params.count - The number of beds to add.
   * @throws Will throw an error if parameters are invalid.
   */
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

  /**
   * Retrieves the total count of a specific bed type across all departments.
   * @param {string} bedType - The type of bed to check.
   * @returns {number|string} - The total count of beds or a message if unavailable.
   * @throws Will throw an error if the bedType is invalid.
   */
  totalBeds(bedType) {
    if (!bedType || typeof bedType !== "string" || bedType.trim() === "")
      throw "Invalid bed type";

    let total = 0;

    for (let department in this.departments) {
      for (let bed of this.departments[department]) {
        if (bed.bedType.toLowerCase() === bedType.toLowerCase()) {
          // Case-insensitive comparison
          total += bed.count;
        }
      }
    }

    return total > 0 ? total : "Bed type not available";
  }

  /**
   * Admits a patient by decreasing the count of an available bed in a department.
   * @param {Object} params - The parameters for admitting a patient.
   * @param {string} params.department - The department name.
   * @param {string} params.bedType - The type of bed to allocate.
   * @throws Will throw an error if the department or bed type is invalid or if no available beds exist.
   * @returns {string|undefined} - A message if the bed type is not available or undefined on success.
   */
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
      if (dept === department) {
        this.departments[dept] = this.departments[dept].map((bed) => {
          if (bed.bedType === bedType) {
            found = true;
            if (bed.count < 1) throw "No available beds in this department";
            return { ...bed, count: bed.count - 1 };
          }
          return bed;
        });
      }
    }

    if (!found) return "Bed type not available";
  }

  /**
   * Retrieves the available bed inventory for a specific department.
   * @param {string} department - The department name.
   * @returns {Array|String} - An array of available beds or a message if the department is not found.
   * @throws Will throw an error if the department identifier is invalid.
   */
  departmentInventory(department) {
    if (
      !department ||
      typeof department !== "string" ||
      department.trim() === ""
    )
      throw "Invalid department identifier";

    department = department.toLowerCase();

    if (!this.departments[department]) return "Department not found";

    const availableBeds = this.departments[department].filter(
      (bed) => bed.count > 0
    );

    return availableBeds.length ? availableBeds : [];
  }
}

module.exports = { HospitalBedManager };
