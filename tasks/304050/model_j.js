const calculator = () => {
    let result = 0;
    return {
      add: function(...nums) {
        nums.forEach((num) => {
          if (typeof num !== 'number') {
            throw new Error('Error encountered: Invalid input for addition');
          }
          result += num;
        });
        return this;
      },
      subtract: function(...nums) {
        nums.forEach((num) => {
          if (typeof num !== 'number') {
            throw new Error('Error encountered: Invalid input for subtraction');
          }
          result -= num;
        });
        return this;
      },
      multiply: function(...nums) {
        nums.forEach((num) => {
          if (typeof num !== 'number') {
            throw new Error('Error encountered: Invalid input for multiplication');
          }
          result *= num;
        });
        return this;
      },
      divide: function(...nums) {
        nums.forEach((num) => {
          if (typeof num !== 'number' || num === 0) {
            throw new Error('Error encountered: Invalid input for division');
          }
          result /= num;
        });
        return this;
      },
      getResult: function(precision) {
        if (precision && typeof precision !== 'number') {
          throw new Error('Error encountered: Invalid precision');
        }
        return precision ? parseFloat(result.toFixed(precision)) : result;
      },
    };
  };
  
  module.exports = { calculator };