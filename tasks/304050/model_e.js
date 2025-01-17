class DiscountCalculator {
    constructor() {
      this.discountRates = new Map([
        ['employee', 0.1],
        ['student', 0.05]
      ]);
    }
  
    isValidUserType(userType) {
      return typeof userType === 'string' && this.discountRates.has(userType);
    }
  
    isValidPrice(price) {
      return typeof price === 'number' && price > 0 && isFinite(price);
    }
  
    getDiscountRate(userType) {
      return this.discountRates.get(userType) || 0;
    }
  
    applyDiscount(price, discountRate) {
      return price * (1 - discountRate);
    }
  
    roundToTwoDecimals(number) {
      return Math.round(number * 100) / 100;
    }
  
    updateDiscountRate(userType, newRate) {
      if (typeof newRate !== 'number' || newRate < 0 || newRate > 1) {
        throw new Error('Invalid discount rate. Must be a number between 0 and 1.');
      }
      this.discountRates.set(userType, newRate);
    }
  
    calculateDiscount(price, userType) {
      if (!this.isValidPrice(price)) {
        throw new Error('Invalid price. Must be a positive number.');
      }
  
      if (!this.isValidUserType(userType)) {
        throw new Error('Invalid user type.');
      }
  
      const discountRate = this.getDiscountRate(userType);
      const discountedPrice = this.applyDiscount(price, discountRate);
      return this.roundToTwoDecimals(discountedPrice);
    }
  }
  
  module.exports = DiscountCalculator;