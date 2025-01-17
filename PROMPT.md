The task does not meet the criteria for a level 4 task.
Test cases must adhere to the format provided by the team lead.
Model responses should be re-evaluated after the test case format has been corrected.
The "Full Stack Trace" field in the test cases should include the response from all models, encompassing both correct and incorrect outputs.

const discountRates = {
    employee: 0.1,
    student: 0.05
};

function isValidUserType(userType) {
    return typeof userType === "string" && userType in discountRates;
}

function isValidPrice(price) {
    return typeof price === "number" && price > 0 && isFinite(price);
}

function getDiscountRate(userType) {
    return discountRates[userType] || 0;
}

function applyDiscount(price, discountRate) {
    return price * (1 - discountRate);
}

function roundToTwoDecimals(number) {
    return Math.round(number * 100) / 100;
}

function updateDiscountRate(userType, newRate) {
    if (typeof newRate !== "number" || newRate < 0 || newRate > 1) {
        throw new Error("Invalid discount rate. Must be a number between 0 and 1.");
    }
    discountRates[userType] = newRate;
}

function calculateDiscount(price, userType) {
    if (!isValidPrice(price)) {
        throw new Error("Invalid price. Must be a positive number.");
    }

    if (!isValidUserType(userType)) {
        throw new Error("Invalid user type.");
    }

    const discountRate = getDiscountRate(userType);
    const discountedPrice = applyDiscount(price, discountRate);
    return roundToTwoDecimals(discountedPrice);
}

module.exports = {
    calculateDiscount,
    updateDiscountRate,
};

I'm tasked with refactoring the code that calculates discounts based on user types. 
While the current implementation works, it lacks scalability and maintainability, making it difficult to add new user types or update discount rates dynamically. 
I need to refactor the code to store discount rates in a flexible structure that can be easily extended. 
The solution should include separate functions for validating the price and user type, applying the discount, and rounding the final price to two decimal places. 
The code must allow dynamic updates to the discount rates and handle invalid inputs such as negative prices and unsupported user types, throwing appropriate error messages. 
The final price should always be returned with two decimal points, even in edge cases.
