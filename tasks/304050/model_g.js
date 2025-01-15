const calculator = () => {
  let result = 0;

  const calc = {
    add: function (...nums) {
      nums.forEach((num) => {
        result += num;
      });
      return calc;
    },
    subtract: function (...nums) {
      nums.forEach((num) => {
        result -= num;
      });
      return calc;
    },
    multiply: function (...nums) {
      nums.forEach((num) => {
        result *= num;
      });
      return calc;
    },
    divide: function (...nums) {
      nums.forEach((num) => {
        if (num === 0) {
          throw new Error("Error encountered: Division by zero");
        }
        result /= num;
      });
      return calc;
    },
    getResult: function (precision) {
      if (precision < 0) {
        throw new Error("Error encountered: Precision cannot be negative");
      }
      return precision ? parseFloat(result.toFixed(precision)) : result;
    },
  };

  return calc;
};

module.exports = { calculator };