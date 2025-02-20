function calculateDeductions({ 
    investments_80c = 0, 
    health_insurance = 0, 
    rent_paid = 0, 
    basic_salary = 0, 
    hra_received = 0, 
    other_deductions = 0 
} = {}) {
    /**
     * TODO: Calculates total deductions based on tax laws.
     */
}

function calculateTax(income, deductions = 0, regime = "old") {
    /**
     * TODO: Calculates tax based on Indian income tax slabs (Old vs. New Regime).
     * Deductions apply only under the Old Tax Regime.
     */
}

module.exports = { calculateDeductions, calculateTax };