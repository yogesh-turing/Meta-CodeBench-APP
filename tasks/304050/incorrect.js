const calculator = () => {
    let result = 0;
  
    const add = (...nums) => {
      nums.forEach((num) => {
        result += num;
      });
      return calculator(result);
    };
  
    const subtract = (...nums) => {
      nums.forEach((num) => {
        result -= num;
      });
      return calculator(result);
    };
  
    const multiply = (...nums) => {
      nums.forEach((num) => {
        result *= num;
      });
      return calculator(result);
    };
  
    const divide = (...nums) => {
      nums.forEach((num) => {
        if (num === 0) {
          throw new Error("Error encountered: Division by zero is not allowed.");
        }
        result /= num;
      });
      return calculator(result);
    };
  
    const getResult = (precision) => {
      return precision ? parseFloat(result.toFixed(precision)) : result;
    };
  
    return {
      add,
      subtract,
      multiply,
      divide,
      getResult,
    };
  };
  
  module.exports = { calculator };