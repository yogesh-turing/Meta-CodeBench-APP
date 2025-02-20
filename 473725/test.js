const { calculateDeductions, calculateTax } = require('./solution');

describe("Tax Calculation Tests", () => {
  // Tests for calculateDeductions
  describe("calculateDeductions", () => {
    test("All deductions within limits", () => {
      const result = calculateDeductions({
        investments_80c: 100000,
        health_insurance: 50000,
        rent_paid: 120000,
        basic_salary: 500000,
        hra_received: 200000,
        other_deductions: 30000
      });
      const expectedHRAExemption = Math.min(200000, 0.5 * 500000, 120000 - (0.1 * 500000));
      const expectedTotal = 100000 + 50000 + expectedHRAExemption + 30000;
      expect(result).toBe(expectedTotal);
    });

    test("Investments exceed 80C limit", () => {
      const result = calculateDeductions({investments_80c:200000, health_insurance:50000, rent_paid:120000, basic_salary:500000, 
        hra_received:200000, other_deductions:30000});
      const expectedTotal = 150000 + 50000 + Math.min(200000, 0.5 * 500000, 120000 - 0.1 * 500000) + 30000;
      expect(result).toBe(expectedTotal);
    });

    test("Health insurance exceeds 80D limit", () => {
      const result = calculateDeductions({investments_80c:100000, health_insurance:100000, rent_paid:120000, basic_salary:500000, 
        hra_received:200000, other_deductions:30000});
      const expectedTotal = 100000 + 75000 + Math.min(200000, 0.5 * 500000, 120000 - 0.1 * 500000) + 30000;
      expect(result).toBe(expectedTotal);
    });

    test("No HRA exemption when rent paid is zero", () => {
      const result = calculateDeductions({investments_80c:100000, health_insurance:50000, rent_paid:0, 
        basic_salary:500000, hra_received:200000, other_deductions:30000});
      expect(result).toBe(100000 + 50000 + 0 + 30000);
    });
  });

  // Tests for calculateTax
  describe("calculateTax", () => {
    test("Old regime with deductions", () => {
      const [result, cess, taxableIncome] = calculateTax(800000, 150000, "old");
      const expectedTaxableIncome = 800000 - 150000;
      const expectedTax = (250000 * 0.00) + (250000 * 0.05) + (150000 * 0.20);
      const expectedCess = Math.round(expectedTax * 0.04 * 100) / 100;
      const expectedTotalTax = Math.round((expectedTax + expectedCess) * 100) / 100;
      expect(taxableIncome).toBe(expectedTaxableIncome);
      expect(result).toBe(expectedTotalTax);
      expect(cess).toBe(expectedCess);
    });

    test("New regime without deductions", () => {
      const [result, cess, taxableIncome] = calculateTax(800000, 150000, "new");
      const expectedTaxableIncome = 800000;
      const expectedTax = (250000 * 0.00) + (250000 * 0.05) + (250000 * 0.10) + (50000 * 0.15);
      const expectedCess = Math.round(expectedTax * 0.04 * 100) / 100;
      const expectedTotalTax = Math.round((expectedTax + expectedCess) * 100) / 100;
      expect(taxableIncome).toBe(expectedTaxableIncome);
      expect(result).toBe(expectedTotalTax);
      expect(cess).toBe(expectedCess);
    });

    test("Negative income should throw error", () => {
      expect(() => calculateTax(-100000, 0, "old")).toThrow(Error);
    });

    test("Invalid regime should throw error", () => {
      expect(() => calculateTax(500000, 0, "invalid")).toThrow(Error);
    });
  });
});