function calculateDeductions({ 
    investments_80c = 0, 
    health_insurance = 0, 
    rent_paid = 0, 
    basic_salary = 0, 
    hra_received = 0, 
    other_deductions = 0 
} = {}) {
    // Limit investments_80c to 1.5 lakhs
    investments_80c = Math.min(investments_80c, 150000);
    
    // Limit health_insurance to 75000
    health_insurance = Math.min(health_insurance, 75000);
    
    // Calculate HRA exemption
    let hra_exemption = 0;
    if (rent_paid > 0 && hra_received > 0) {
        hra_exemption = Math.min(hra_received, Math.min(0.5 * basic_salary, rent_paid - 0.1 * basic_salary));
    }
    
    // Calculate total deduction
    let total_deduction = investments_80c + health_insurance + hra_exemption + other_deductions;
    
    return total_deduction;
}

function calculateTax(income, deductions = 0, regime = "old") {
    // Check if income or deductions are less than 0
    if (income < 0 || deductions < 0) {
        throw new Error("Income and deductions must be non-negative.");
    }
    
    // Check if regime is valid
    if (regime !== "old" && regime !== "new") {
        throw new Error("Invalid regime. Must be 'old' or 'new'.");
    }
    
    // Calculate taxable income
    let taxable_income = income;
    if (regime === "old") {
        taxable_income -= deductions;
    }
    
    // Calculate tax
    let tax = 0;
    if (regime === "old") {
        if (taxable_income <= 250000) {
            tax = 0;
        } else if (taxable_income <= 500000) {
            tax = 0.05 * (taxable_income - 250000);
        } else if (taxable_income <= 1000000) {
            tax = 0.05 * 250000 + 0.2 * (taxable_income - 500000);
        } else {
            tax = 0.05 * 250000 + 0.2 * 500000 + 0.3 * (taxable_income - 1000000);
        }
    } else {
        if (taxable_income <= 250000) {
            tax = 0;
        } else if (taxable_income <= 500000) {
            tax = 0.05 * (taxable_income - 250000);
        } else if (taxable_income <= 750000) {
            tax = 0.05 * 250000 + 0.1 * (taxable_income - 500000);
        } else if (taxable_income <= 1000000) {
            tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * (taxable_income - 750000);
        } else if (taxable_income <= 1250000) {
            tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * 250000 + 0.2 * (taxable_income - 1000000);
        } else if (taxable_income <= 1500000) {
            tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * 250000 + 0.2 * 250000 + 0.25 * (taxable_income - 1250000);
        } else {
            tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * 250000 + 0.2 * 250000 + 0.25 * 250000 + 0.3 * (taxable_income - 1500000);
        }
    }
    
    // Calculate cess
    let cess = 0.04 * tax;
    
    // Round tax and cess to 2 decimal points
    tax = Math.round(tax * 100) / 100;
    cess = Math.round(cess * 100) / 100;
    
    return [tax, cess, taxable_income];
}

module.exports = { calculateDeductions, calculateTax };