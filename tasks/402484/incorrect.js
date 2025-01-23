const discountRates = {
    employee: 0.1,
    student: 0.05
  };
  
  function isValidUserType(userType) {
    return userType in discountRates;
  }
  
  function isValidPrice(price) {
    return price > 0;
  }
  
  function getDiscountRate(userType) {
    return discountRates[userType];
  }
  
  function applyDiscount(price, discountRate) {
    return price * discountRate;
  }
  
  function roundToTwoDecimals(number) {
    return Math.floor(number * 100) / 100;
  }
  
  function updateDiscountRate(userType, newRate) {
    if (newRate < 0 || newRate > 1) {
      throw new Error("Invalid rate");
    }
    discountRates[userType] = newRate;
  }
  
  function calculateDiscount(price, userType) {
    if (!isValidPrice(price)) {
      throw new Error("Invalid price");
    }
  
    if (!isValidUserType(userType)) {
      throw new Error("Invalid user type");
    }
  
    const discountRate = getDiscountRate(userType);
    const discountedPrice = applyDiscount(price, discountRate);
    return roundToTwoDecimals(discountedPrice);
  }
  
  module.exports = {
    calculateDiscount,
    updateDiscountRate,
  };
  