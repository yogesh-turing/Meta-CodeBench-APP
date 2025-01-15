const calculator = () => {
    let result = 0;
    const calc = {
        add: function(...nums) {
            if (nums.length === 0) throw new Error('Error encountered');
            nums.forEach(num => {
                if (typeof num !== 'number') throw new Error('Error encountered');
                result += num;
            });
            return this;
        },
        subtract: function(...nums) {
            if (nums.length === 0) throw new Error('Error encountered');
            nums.forEach(num => {
                if (typeof num !== 'number') throw new Error('Error encountered');
                result -= num;
            });
            return this;
        },
        multiply: function(...nums) {
            if (nums.length === 0) throw new Error('Error encountered');
            nums.forEach(num => {
                if (typeof num !== 'number') throw new Error('Error encountered');
                result *= num;
            });
            return this;
        },
        divide: function(...nums) {
            if (nums.length === 0) throw new Error('Error encountered');
            nums.forEach(num => {
                if (typeof num !== 'number') throw new Error('Error encountered');
                if (num === 0) throw new Error('Error encountered');
                result /= num;
            });
            return this;
        },
        getResult: function(precision) {
            if (precision !== undefined && (!Number.isInteger(precision) || precision < 0)) {
                throw new Error('Error encountered');
            }
            return precision !== undefined ? parseFloat(result.toFixed(precision)) : result;
        }
    };
    return calc;
};

module.exports = { calculator };