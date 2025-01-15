// function to check if both objects are the same 
const equalObjects = (jsonData1, jsonData2) => {
    const isValidJson = (data) => {
      // Check if data is null or undefined
      if (data === null || data === undefined) {
        return false;
      }
  
      // Check if data is an object or an array
      if (typeof data !== 'object') {
        return false;
      }
  
      // If data is an array, check if all elements are objects or primitive values
      if (Array.isArray(data)) {
        return data.every((item) => isValidJson(item) || typeof item !== 'object');
      }
  
      // If data is an object, check if all values are objects, arrays or primitive values
      return Object.values(data).every((value) => isValidJson(value) || typeof value !== 'object');
    };
  
    if (!isValidJson(jsonData1) || !isValidJson(jsonData2)) {
      throw new Error("Error encountered")
    }
  
    const isEqual = (data1, data2) => {
      // If both data are arrays, compare them
      if (Array.isArray(data1) && Array.isArray(data2)) {
        // If arrays have different lengths, they are not equal
        if (data1.length !== data2.length) {
          return false;
        }
  
        // Compare each element of the arrays
        for (let i = 0; i < data1.length; i++) {
          if (!isEqual(data1[i], data2[i])) {
            return false;
          }
        }
  
        return true;
      }
  
      // If both data are objects, compare them
      if (typeof data1 === 'object' && typeof data2 === 'object') {
        // If objects have different number of keys, they are not equal
        if (Object.keys(data1).length !== Object.keys(data2).length) {
          return false;
        }
  
        // Compare each key-value pair of the objects
        for (const key in data1) {
          if (!isEqual(data1[key], data2[key])) {
            return false;
          }
        }
  
        return true;
      }
  
      // If data are primitive values, compare them
      return data1 === data2;
    }
  
    return isEqual(jsonData1, jsonData2);
  };
  
  module.exports = { equalObjects };