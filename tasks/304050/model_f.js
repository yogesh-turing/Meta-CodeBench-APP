const calculator = () => {
    let result = 0;
    return {
      add: function (...nums) {
        nums.forEach((num) => {
          result += num;
        });
        return this;
      },
      subtract: function (...nums) {
        nums.forEach((num) => {
          result -= num;
        });
        return this;
      },
      multiply: function (...nums) {
        nums.forEach((num) => {
          result *= num;
        });
        return this;
      },
      divide: function (...nums) {
        nums.forEach((num) => {
          if (num === 0) {
            throw new Error('Error encountered: Division by zero');
          }
          result /= num;
        });
        return this;
      },
      getResult: function (precision) {
        return precision ? parseFloat(result.toFixed(precision)) : result;
      }
    };
  };
  
  module.exports = { calculator };