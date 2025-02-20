function calculateDeductions({ 
    investments_80c = 0, 
    health_insurance = 0, 
    rent_paid = 0, 
    basic_salary = 0, 
    hra_received = 0, 
    other_deductions = 0 
} = {}) {
    // Apply limits on 80C investments
    const eligible_80c = Math.min(investments_80c, 150000);
    
    // Apply limits on health insurance
    const eligible_health = Math.min(health_insurance, 75000);
    
    // Calculate HRA exemption
    let hra_exemption = 0;
    if (rent_paid > 0 && hra_received > 0) {
        const fifty_percent_basic = 0.5 * basic_salary;
        const rent_minus_ten_percent = rent_paid - (0.1 * basic_salary);
        hra_exemption = Math.min(
            hra_received,
            fifty_percent_basic,
            rent_minus_ten_percent
        );
        hra_exemption = Math.max(hra_exemption, 0); // Ensure non-negative
    }
    
    // Calculate total deductions
    return eligible_80c + eligible_health + hra_exemption + other_deductions;
}

function calculateTax(income, deductions = 0, regime = "old") {
    // Input validation
    if (income < 0 || deductions < 0) {
        throw new Error("Income and deductions cannot be negative");
    }
    
    if (regime !== "old" && regime !== "new") {
        throw new Error("Invalid regime type. Must be 'old' or 'new'");
    }
    
    // Calculate taxable income for old regime
    const taxableIncome = regime === "old" ? Math.max(income - deductions, 0) : income;
    let tax = 0;
    
    if (regime === "old") {
        // Old regime tax calculation
        if (taxableIncome > 1000000) {
            tax += (taxableIncome - 1000000) * 0.3;
            tax += 500000 * 0.2;
            tax += 250000 * 0.05;
        } else if (taxableIncome > 500000) {
            tax += (taxableIncome - 500000) * 0.2;
            tax += 250000 * 0.05;
        } else if (taxableIncome > 250000) {
            tax += (taxableIncome - 250000) * 0.05;
        }
    } else {
        // New regime tax calculation
        if (taxableIncome > 1500000) {
            tax += (taxableIncome - 1500000) * 0.3;
            tax += 250000 * 0.25;
            tax += 250000 * 0.2;
            tax += 250000 * 0.15;
            tax += 250000 * 0.1;
            tax += 250000 * 0.05;
        } else if (taxableIncome > 1250000) {
            tax += (taxableIncome - 1250000) * 0.25;
            tax += 250000 * 0.2;
            tax += 250000 * 0.15;
            tax += 250000 * 0.1;
            tax += 250000 * 0.05;
        } else if (taxableIncome > 1000000) {
            tax += (taxableIncome - 1000000) * 0.2;
            tax += 250000 * 0.15;
            tax += 250000 * 0.1;
            tax += 250000 * 0.05;
        } else if (taxableIncome > 750000) {
            tax += (taxableIncome - 750000) * 0.15;
            tax += 250000 * 0.1;
            tax += 250000 * 0.05;
        } else if (taxableIncome > 500000) {
            tax += (taxableIncome - 500000) * 0.1;
            tax += 250000 * 0.05;
        } else if (taxableIncome > 250000) {
            tax += (taxableIncome - 250000) * 0.05;
        }
    }
    
    // Calculate cess (4% of tax)
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    
    return [
        Number(totalTax.toFixed(2)),
        Number(cess.toFixed(2)),
        taxableIncome
    ];
}

module.exports = { calculateDeductions, calculateTax };