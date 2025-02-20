//hospitalBedManager.test.js
const { HospitalBedManager } = require("./solution");

describe("🏥 HospitalBedManager", () => {
  let hospital;

  beforeEach(() => {
    hospital = new HospitalBedManager();
  });

  // ✅ Adding Beds
  describe("✅ Adding Beds", () => {
    test("should correctly add beds to a department", () => {
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 10 });
      expect(hospital.departmentInventory("ICU")).toEqual([
        { bedType: "Ventilator", count: 10 },
      ]);
    });

    test("should update the count if the same bed type is added again in the same department", () => {
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 5 });
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 3 });
      expect(hospital.departmentInventory("ICU")).toEqual([
        { bedType: "Ventilator", count: 8 },
      ]);
    });

    test("should allow adding beds to different departments", () => {
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 5 });
      hospital.addBeds({
        department: "Emergency",
        bedType: "General",
        count: 7,
      });
      expect(hospital.departmentInventory("ICU")).toEqual([
        { bedType: "Ventilator", count: 5 },
      ]);
      expect(hospital.departmentInventory("Emergency")).toEqual([
        { bedType: "General", count: 7 },
      ]);
    });

    test("should throw an error if the bed count is zero or negative", () => {
      expect(() =>
        hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 0 })
      ).toThrow("Invalid bed count");
      expect(() =>
        hospital.addBeds({
          department: "ICU",
          bedType: "Ventilator",
          count: -3,
        })
      ).toThrow("Invalid bed count");
    });

    test("should reject empty department names", () => {
      expect(() =>
        hospital.addBeds({ department: "", bedType: "Ventilator", count: 5 })
      ).toThrow("Invalid department identifier");
      expect(() =>
        hospital.addBeds({ department: "   ", bedType: "Ventilator", count: 5 })
      ).toThrow("Invalid department identifier");
    });
  });

  // ✅ Checking Total Bed Availability
  describe("✅ Checking Total Bed Availability", () => {
    test("should return the correct total count of a bed type across all departments", () => {
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 5 });
      hospital.addBeds({
        department: "Emergency",
        bedType: "Ventilator",
        count: 3,
      });
      expect(hospital.totalBeds("Ventilator")).toBe(8);
    });

    test("should return 'Bed type not available' if no beds of the requested type exist", () => {
      expect(hospital.totalBeds("Ventilator")).toBe("Bed type not available");
    });

    test("should handle case-insensitive department names", () => {
      hospital.addBeds({ department: "ICU", bedType: "General", count: 5 });
      expect(hospital.totalBeds("general")).toBe(5);
    });
  });

  // ✅ Patient Admissions
  describe("✅ Patient Admissions", () => {
    test("should decrease available beds when a patient is admitted", () => {
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 5 });
      hospital.admitPatient({ department: "ICU", bedType: "Ventilator" });
      expect(hospital.departmentInventory("ICU")).toEqual([
        { bedType: "Ventilator", count: 4 },
      ]);
    });

    test("should not allow admission if no beds are available", () => {
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 1 });
      hospital.admitPatient({ department: "ICU", bedType: "Ventilator" });
      expect(() =>
        hospital.admitPatient({ department: "ICU", bedType: "Ventilator" })
      ).toThrow("No available beds in this department");
    });

    test("should return 'Bed type not available' if the requested bed type does not exist", () => {
      hospital.addBeds({ department: "ICU", bedType: "General", count: 5 });
      expect(
        hospital.admitPatient({ department: "ICU", bedType: "Ventilator" })
      ).toBe("Bed type not available");
    });

    test("should ensure department-specific admissions do not affect other departments", () => {
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 5 });
      hospital.addBeds({
        department: "Emergency",
        bedType: "General",
        count: 5,
      });

      hospital.admitPatient({ department: "ICU", bedType: "Ventilator" });

      expect(hospital.departmentInventory("ICU")).toEqual([
        { bedType: "Ventilator", count: 4 },
      ]);
      expect(hospital.departmentInventory("Emergency")).toEqual([
        { bedType: "General", count: 5 },
      ]);
    });

    test("should handle case-insensitive department names", () => {
      hospital.addBeds({ department: "ICU", bedType: "General", count: 5 });
      hospital.admitPatient({ department: "icu", bedType: "General" });
      expect(hospital.departmentInventory("ICU")).toEqual([
        { bedType: "General", count: 4 },
      ]);
    });
  });

  // ✅ Checking Department Inventory
  describe("✅ Checking Department Inventory", () => {
    test("should return all available beds in a given department", () => {
      hospital.addBeds({
        department: "Emergency",
        bedType: "General",
        count: 5,
      });
      hospital.addBeds({ department: "Emergency", bedType: "ICU", count: 2 });
      expect(hospital.departmentInventory("Emergency")).toEqual([
        { bedType: "General", count: 5 },
        { bedType: "ICU", count: 2 },
      ]);
    });

    test("should return 'Department not found' for unknown departments", () => {
      expect(hospital.departmentInventory("UnknownDept")).toBe(
        "Department not found"
      );
    });

    test("should return an empty list if the department exists but has no beds", () => {
      hospital.addBeds({
        department: "Pediatrics",
        bedType: "General",
        count: 3,
      });
      hospital.admitPatient({ department: "Pediatrics", bedType: "General" });
      hospital.admitPatient({ department: "Pediatrics", bedType: "General" });
      hospital.admitPatient({ department: "Pediatrics", bedType: "General" });
      expect(hospital.departmentInventory("Pediatrics")).toEqual([]);
    });

    test("should handle case-insensitive department names", () => {
      hospital.addBeds({ department: "ICU", bedType: "General", count: 5 });
      expect(hospital.departmentInventory("icu")).toEqual([
        { bedType: "General", count: 5 },
      ]);
    });
  });

  // ✅ Edge Cases
  describe("✅ Edge Cases", () => {
    test("should reject invalid department names during bed addition", () => {
      expect(() =>
        hospital.addBeds({ department: "", bedType: "General", count: 5 })
      ).toThrow("Invalid department identifier");
      expect(() =>
        hospital.addBeds({ department: "  ", bedType: "General", count: 5 })
      ).toThrow("Invalid department identifier");
    });

    test("should reject invalid bed types during admission", () => {
      hospital.addBeds({ department: "ICU", bedType: "Ventilator", count: 5 });
      expect(() =>
        hospital.admitPatient({ department: "ICU", bedType: "" })
      ).toThrow("Invalid bed type");
      expect(() =>
        hospital.admitPatient({ department: "ICU", bedType: "  " })
      ).toThrow("Invalid bed type");
    });
  });
});
