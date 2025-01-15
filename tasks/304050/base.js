const calculator = () => {
  let result = 0;
 return (operation) => {
   if (operation === 'add') {
     return function (...nums) {
       nums.forEach((num) => {
         result += num;
       });
       return calculator(result);
     }
   } else if (operation === 'subtract') {
     return function (...nums) {
       nums.forEach((num) => {
         result -= num;
       });
       return calculator(result);
     }
   } else if (operation === 'multiply') {
     return function (...nums) {
       nums.forEach((num) => {
         result *= num;
       });
       return calculator(result);
     }
   } else if (operation === 'divide') {
     return function (...nums) {
       nums.forEach((num) => {
         result /= num;
       });
       return calculator(result);
     }
   } else if (operation === 'getResult')  {
     return function (precision) {
       return precision ? parseFloat(result.toFixed(precision)) : result
 }
}

module.exports = { calculator };