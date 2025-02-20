function calculateDeductions({
    investments_80c = 0,
    health_insurance = 0,
    rent_paid = 0,
    basic_salary = 0,
    hra_received = 0,
    other_deductions = 0
} = {}) {
    // Apply sub limits
    const limitedInvestments80c = Math.min(investments_80c, 150000);
    const limitedHealthInsurance = Math.min(health_insurance, 75000);

    // Calculate HRA exemption
    let hraExemption = 0;
    if (rent_paid > 0 && hra_received > 0) {
        hraExemption = Math.min(hra_received, Math.min(0.5 * basic_salary, rent_paid - 0.1 * basic_salary));
    }

    // Calculate total deduction
    const totalDeduction = limitedInvestments80c + limitedHealthInsurance + hraExemption + other_deductions;

    return totalDeduction;
}

function calculateTax(income, deductions = 0, regime = "old") {
    // Validate income and deductions
    if (income < 0 || deductions < 0) {
        throw new Error("Income and deductions cannot be less than 0");
    }

    // Validate regime
    if (regime !== "old" && regime !== "new") {
        throw new Error("Invalid regime. Regime must be either 'old' or 'new'");
    }

    let taxableIncome = income;
    if (regime === "old") {
        taxableIncome -= deductions;
    }

    // Calculate tax based on regime
    let tax = 0;
    if (regime === "old") {
        if (taxableIncome <= 250000) {
            tax = 0;
        } else if (taxableIncome <= 500000) {
            tax = 0.05 * (taxableIncome - 250000);
        } else if (taxableIncome <= 1000000) {
            tax = 0.05 * 250000 + 0.2 * (taxableIncome - 500000);
        } else {
            tax = 0.05 * 250000 + 0.2 * 500000 + 0.3 * (taxableIncome - 1000000);
        }
    } else if (regime === "new") {
        if (taxableIncome <= 250000) {
            tax = 0;
        } else if (taxableIncome <= 500000) {
            tax = 0.05 * (taxableIncome - 250000);
        } else if (taxableIncome <= 750000) {
            tax = 0.05 * 250000 + 0.1 * (taxableIncome - 500000);
        } else if (taxableIncome <= 1000000) {
            tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * (taxableIncome - 750000);
        } else if (taxableIncome <= 1250000) {
            tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * 250000 + 0.2 * (taxableIncome - 1000000);
        } else if (taxableIncome <= 1500000) {
            tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * 250000 + 0.2 * 250000 + 0.25 * (taxableIncome - 1250000);
        } else {
            tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * 250000 + 0.2 * 250000 + 0.25 * 250000 + 0.3 * (taxableIncome - 1500000);
        }
    }

    // Apply 4% cess
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    // Round tax and cess to 2 decimal points
    const roundedTotalTax = Math.round(totalTax * 100) / 100;
    const roundedCess = Math.round(cess * 100) / 100;

    return [roundedTotalTax, roundedCess, taxableIncome];
}

module.exports = { calculateDeductions, calculateTax };