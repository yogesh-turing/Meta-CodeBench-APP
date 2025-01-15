// Function to check if both objects are the same
const equalObjects = (jsonData1, jsonData2) => {
    // Validate if the input is a valid JSON
    const isValidJson = (data) => {
      // Check if the input is a valid JSON
      if (data === null || data === undefined) {
        return false;
      }
      if (typeof data === "object") {
        return true;
      }
      if (typeof data === "number" || typeof data === "string" || typeof data === "boolean") {
        return true;
      }
      return false;
    };
  
    // Check if either of the inputs is not a valid JSON
    if (!isValidJson(jsonData1) || !isValidJson(jsonData2)) {
      throw new Error("Error encountered");
    }
  
    // Function to check if two objects are equal
    const isEqual = (data1, data2) => {
      // If both are primitive values, compare them directly
      if (typeof data1 !== "object" && typeof data2 !== "object") {
        return data1 === data2;
      }
  
      // If one is an object and the other is not, they are not equal
      if (typeof data1 !== "object" || typeof data2 !== "object") {
        return false;
      }
  
      // If both are arrays, compare them recursively
      if (Array.isArray(data1) && Array.isArray(data2)) {
        if (data1.length !== data2.length) {
          return false;
        }
        for (let i = 0; i < data1.length; i++) {
          if (!isEqual(data1[i], data2[i])) {
            return false;
          }
        }
        return true;
      }
  
      // If both are objects, compare their properties recursively
      const keys1 = Object.keys(data1);
      const keys2 = Object.keys(data2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (let i = 0; i < keys1.length; i++) {
        const key = keys1[i];
        if (!isEqual(data1[key], data2[key])) {
          return false;
        }
      }
      return true;
    };
  
    // Return if the objects are equal or not
    return isEqual(jsonData1, jsonData2);
  };
  
  module.exports = { equalObjects };