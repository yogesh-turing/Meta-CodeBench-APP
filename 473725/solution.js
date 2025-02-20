function calculateDeductions({ investments_80c = 0, health_insurance = 0, rent_paid = 0, basic_salary = 0, hra_received = 0, other_deductions = 0 }) {
    const max80C = 150000; // Section 80C max limit
    const max80D = 75000;  // 80D limit for self/family

    // 80C Calculation (PPF, EPF, ELSS, etc.)
    const deduction80C = Math.min(investments_80c, max80C);

    // 80D Calculation (Health Insurance Premiums)
    const deduction80D = Math.min(health_insurance, max80D);

    // HRA Calculation (House Rent Allowance)
    let hraExemption = (hra_received && rent_paid) ? Math.min(
        hra_received,
        0.5 * basic_salary, // 50% of basic salary (for metro cities)
        rent_paid - (0.1 * basic_salary) // Rent Paid - 10% of Basic Salary
    ) : 0;
    if (hraExemption<0){
        hraExemption = rent_paid;
    }

    // Total Deductions
    const totalDeductions = deduction80C + deduction80D + hraExemption + other_deductions;
    return totalDeductions;
}

function calculateTax(income, deductions = 0, regime = "old") {
    if (income < 0 || deductions < 0) {
        throw new Error("Income and deductions cannot be negative");
    }
    if (!["old", "new"].includes(regime)) {
        throw new Error("Invalid regime. Choose 'old' or 'new'");
    }

    const taxBracketsOld = [
        [250000, 0.00],
        [500000, 0.05],
        [1000000, 0.20],
        [Infinity, 0.30]
    ];

    const taxBracketsNew = [
        [250000, 0.00],
        [500000, 0.05],
        [750000, 0.10],
        [1000000, 0.15],
        [1250000, 0.20],
        [1500000, 0.25],
        [Infinity, 0.30]
    ];

    const taxBrackets = regime === "new" ? taxBracketsNew : taxBracketsOld;
    const taxableIncome = Math.max(0, income - (regime === "old" ? deductions : 0));

    let tax = 0;
    let previousLimit = 0;

    for (const [limit, rate] of taxBrackets) {
        if (taxableIncome > previousLimit) {
            const taxableAmount = Math.min(taxableIncome, limit) - previousLimit;
            tax += taxableAmount * rate;
            previousLimit = limit;
        } else {
            break;
        }
    }

    const cess = parseFloat((tax * 0.04).toFixed(2)); // 4% Health & Education Cess
    const totalTax = parseFloat((tax + cess).toFixed(2));

    return [totalTax, cess, taxableIncome]; 
}

module.exports =  { calculateDeductions, calculateTax };