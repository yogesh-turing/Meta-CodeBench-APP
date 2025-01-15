const calculator = (initialValue = 0) => {
    let result = initialValue;
  
    const calc = {
      add: (...nums) => {
        nums.forEach(num => {
          if (typeof num !== 'number') throw new Error('Error encountered');
          result += num;
        });
        return calc;
      },
      subtract: (...nums) => {
        nums.forEach(num => {
          if (typeof num !== 'number') throw new Error('Error encountered');
          result -= num;
        });
        return calc;
      },
      multiply: (...nums) => {
        nums.forEach(num => {
          if (typeof num !== 'number') throw new Error('Error encountered');
          result *= num;
        });
        return calc;
      },
      divide: (...nums) => {
        nums.forEach(num => {
          if (typeof num !== 'number'|| num === 0) throw new Error('Error encountered');
          result /= num;
        });
        return calc;
      },
      getResult: (precision) => {
        if (precision !== undefined && (typeof precision !== 'number' || precision < 0)) {
          throw new Error('Error encountered');
        }
        return precision !== undefined ? parseFloat(result.toFixed(precision)) : result;
      }
    };
  
    return calc;
  };
  
  module.exports = { calculator };