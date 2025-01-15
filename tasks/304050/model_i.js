const calculator = () => {
    let result = 0;
    return {
      add: (...nums) => {
        nums.forEach((num) => {
          result += num;
        });
        return calculator();
      },
      subtract: (...nums) => {
        nums.forEach((num) => {
          result -= num;
        });
        return calculator();
      },
      multiply: (...nums) => {
        nums.forEach((num) => {
          result *= num;
        });
        return calculator();
      },
      divide: (...nums) => {
        nums.forEach((num) => {
          if (num === 0) {
            throw new Error('Error encountered: Division by zero is not allowed');
          }
          result /= num;
        });
        return calculator();
      },
      getResult: (precision) => {
        if (precision) {
          return parseFloat(result.toFixed(precision));
        } else {
          return result;
        }
      },
    };
  };
  
  module.exports = { calculator };