function processData(input) {
    return input.map(num => {
      // Handle invalid cases
      if (typeof num === "number" && !Number.isFinite(num)) return "INVALID";
  
      // Handle BigInt values without converting to regular numbers
      if (typeof num === "bigint") {
        let strNum = num.toString();
        let isNegative = strNum.startsWith("-");
        if (isNegative) strNum = strNum.slice(1);
        return (isNegative ? "-" : "") + strNum.split("").reverse().join("");
      }
  
      // Handle integers
      if (Number.isInteger(num)) {
        let strNum = num.toString();
        // Preserve single-digit numbers as they are
        if (strNum.length === 1 || (strNum.length === 2 && strNum[0] === "-")) return strNum;
        let isNegative = strNum.startsWith("-");
        if (isNegative) strNum = strNum.slice(1);
        return (isNegative ? "-" : "") + strNum.split("").reverse().join("");
      }
  
      // Convert floats to string, preserving trailing zeros for values >= 1
      let strNum = Math.abs(num) < 1 ? num.toString() : num.toFixed(3);
  
      // Split into integer and decimal parts
      if (strNum.includes(".")) {
        let [intPart, decPart] = strNum.split(".");
        let isNegative = intPart.startsWith("-");
        if (isNegative) intPart = intPart.slice(1);
  
        // If integer part is a single digit, reverse only the decimal part
        if (intPart.length === 1) {
          return (isNegative ? "-" : "") + intPart + "." + decPart.split("").reverse().join("");
        }
  
        // Reverse both integer and decimal parts separately
        return (isNegative ? "-" : "") + intPart.split("").reverse().join("") + "." + decPart.split("").reverse().join("");
      }
  
      return strNum;
    }).join("|");
  }
  
  module.exports = { processData };