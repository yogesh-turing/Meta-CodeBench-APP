function calculateDeductions({ 
    investments_80c = 0, 
    health_insurance = 0, 
    rent_paid = 0, 
    basic_salary = 0, 
    hra_received = 0, 
    other_deductions = 0 
} = {}) {
    if (investments_80c < 0 || health_insurance < 0 || rent_paid < 0 || basic_salary < 0 || hra_received < 0 || other_deductions < 0) {
        throw new Error("All input values must be non-negative.");
    }

    // Calculate HRA exemption
    let hra_exemption = 0;
    if (rent_paid > 0 && hra_received > 0) {
        hra_exemption = Math.min(hra_received, Math.min(0.5 * basic_salary, rent_paid - 0.1 * basic_salary));
    }

    // Calculate total deductions
    let total_deductions = Math.min(investments_80c, 150000) + Math.min(health_insurance, 75000) + hra_exemption + other_deductions;

    return total_deductions;
}

function calculateTax(income, deductions = 0, regime = "old") {
    if (income < 0 || deductions < 0) {
        throw new Error("Income and deductions must be non-negative.");
    }
    if (regime !== "old" && regime !== "new") {
        throw new Error("Invalid regime. Regime must be either 'old' or 'new'.");
    }

    let taxable_income;
    if (regime === "old") {
        taxable_income = income - deductions;
    } else {
        taxable_income = income;
    }

    let tax;
    if (regime === "old") {
        if (taxable_income <= 250000) {
            tax = 0;
        } else if (taxable_income <= 500000) {
            tax = 0.05 * (taxable_income - 250000);
        } else if (taxable_income <= 1000000) {
            tax = 12500 + 0.2 * (taxable_income - 500000);
        } else {
            tax = 112500 + 0.3 * (taxable_income - 1000000);
        }
    } else {
        if (taxable_income <= 250000) {
            tax = 0;
        } else if (taxable_income <= 500000) {
            tax = 0.05 * (taxable_income - 250000);
        } else if (taxable_income <= 750000) {
            tax = 12500 + 0.1 * (taxable_income - 500000);
        } else if (taxable_income <= 1000000) {
            tax = 37500 + 0.15 * (taxable_income - 750000);
        } else if (taxable_income <= 1250000) {
            tax = 75000 + 0.2 * (taxable_income - 1000000);
        } else if (taxable_income <= 1500000) {
            tax = 125000 + 0.25 * (taxable_income - 1250000);
        } else {
            tax = 187500 + 0.3 * (taxable_income - 1500000);
        }
    }

    let cess = 0.04 * tax;
    let total_tax = tax + cess;

    total_tax = Math.round(total_tax * 100) / 100;
    cess = Math.round(cess * 100) / 100;

    return [total_tax, cess, taxable_income];
}

module.exports = { calculateDeductions, calculateTax };