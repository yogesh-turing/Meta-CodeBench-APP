const discountRates = new Map([
    ['employee', 0.1],
    ['student', 0.05]
  ]);
  
  function isValidUserType(userType) {
    return typeof userType === 'string' && discountRates.has(userType);
  }
  
  function isValidPrice(price) {
    return typeof price === 'number' && price > 0 && isFinite(price);
  }
  
  function isValidDiscountRate(rate) {
    return typeof rate === 'number' && rate >= 0 && rate <= 1;
  }
  
  function getDiscountRate(userType) {
    return discountRates.get(userType) || 0;
  }
  
  function applyDiscount(price, discountRate) {
    return price * (1 - discountRate);
  }
  
  function roundToTwoDecimals(number) {
    return Number(number.toFixed(2));
  }
  
  function updateDiscountRate(userType, newRate) {
    if (!isValidDiscountRate(newRate)) {
      throw new Error('Invalid discount rate. Must be a number between 0 and 1.');
    }
    discountRates.set(userType, newRate);
  }
  
  function addDiscountRate(userType, rate) {
    if (typeof userType !== 'string' || userType.trim() === '') {
      throw new Error('Invalid user type. Must be a non-empty string.');
    }
    if (!isValidDiscountRate(rate)) {
      throw new Error('Invalid discount rate. Must be a number between 0 and 1.');
    }
    discountRates.set(userType, rate);
  }
  
  function calculateDiscount(price, userType) {
    if (!isValidPrice(price)) {
      throw new Error('Invalid price. Must be a positive number.');
    }
  
    if (!isValidUserType(userType)) {
      throw new Error('Invalid user type.');
    }
  
    const discountRate = getDiscountRate(userType);
    const discountedPrice = applyDiscount(price, discountRate);
    return roundToTwoDecimals(discountedPrice);
  }
  
  module.exports = {
    calculateDiscount,
    updateDiscountRate,
    addDiscountRate,
  };