const discountRates = {
    employee: 0.1,
    student: 0.05,
    // Add new user types here
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