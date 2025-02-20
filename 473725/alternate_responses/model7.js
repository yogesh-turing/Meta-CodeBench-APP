function calculateDeductions({
  investments_80c = 0,
  health_insurance = 0,
  rent_paid = 0,
  basic_salary = 0,
  hra_received = 0,
  other_deductions = 0,
} = {}) {
  /**
   * Calculates total deductions based on tax laws.
   */
  let hraExemption = 0;
  if (rent_paid > 0 && hra_received > 0) {
    hraExemption = Math.min(
      hra_received,
      (50 / 100) * basic_salary,
      rent_paid - (10 / 100) * basic_salary
    );
  }
  const totalDeduction =
    Math.min(investments_80c, 150000) +
    Math.min(health_insurance, 75000) +
    hraExemption +
    other_deductions;

  return totalDeduction;
}

function calculateTax(income, deductions = 0, regime = "old") {
  /**
   * Calculates tax based on Indian income tax slabs (Old vs. New Regime).
   * Deductions apply only under the Old Tax Regime.
   */
  if (income < 0 || deductions < 0) {
    throw new Error("Income or deductions cannot be negative.");
  }
  if (regime !== "old" && regime !== "new") {
    throw new Error("Invalid regime. Please choose 'old' or 'new'.");
  }

  let taxableIncome = income;
  if (regime === "old") {
    taxableIncome -= deductions;
  }

  let tax = 0;
  if (regime === "old") {
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = (taxableIncome - 500000) * 0.2 + 12500;
    } else {
      tax = (taxableIncome - 1000000) * 0.3 + 112500;
    }
  } else {
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 750000) {
      tax = (taxableIncome - 500000) * 0.1 + 12500;
    } else if (taxableIncome <= 1000000) {
      tax = (taxableIncome - 750000) * 0.15 + 37500;
    } else if (taxableIncome <= 1250000) {
      tax = (taxableIncome - 1000000) * 0.2 + 75000;
    } else if (taxableIncome <= 1500000) {
      tax = (taxableIncome - 1250000) * 0.25 + 125000;
    } else {
      tax = (taxableIncome - 1500000) * 0.3 + 187500;
    }
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return [
    Math.round(totalTax * 100) / 100,
    Math.round(cess * 100) / 100,
    taxableIncome,
  ];
}

module.exports = { calculateDeductions, calculateTax };