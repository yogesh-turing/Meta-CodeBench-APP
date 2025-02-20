function calculateDeductions({ 
    investments_80c = 0, 
    health_insurance = 0, 
    rent_paid = 0, 
    basic_salary = 0, 
    hra_received = 0, 
    other_deductions = 0 
} = {}) {
    // Apply sub limits
    investments_80c = Math.min(investments_80c, 150000);
    health_insurance = Math.min(health_insurance, 75000);

    // Calculate HRA exemption
    let hra_exemption = 0;
    if (rent_paid > 0 && hra_received > 0) {
        hra_exemption = Math.min(hra_received, Math.min(0.5 * basic_salary, rent_paid - 0.1 * basic_salary));
    }

    // Calculate total deductions
    const totalDeductions = investments_80c + health_insurance + hra_exemption + other_deductions;

    return totalDeductions;
}

function calculateTax(income, deductions = 0, regime = "old") {
    // Validate inputs
    if (income < 0 || deductions < 0) {
        throw new Error("Income and deductions cannot be negative.");
    }
    if (regime !== "old" && regime !== "new") {
        throw new Error("Invalid tax regime. Supported regimes are 'old' and 'new'.");
    }

    // Calculate taxable income for old regime
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

    // Calculate cess
    const cess = tax * 0.04;

    // Round tax and cess to 2 decimal points
    tax = Math.round(tax * 100) / 100;
    cess = Math.round(cess * 100) / 100;

    return [tax + cess, cess, taxableIncome];
}

module.exports = { calculateDeductions, calculateTax };