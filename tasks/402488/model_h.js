// function to check if both objects are the same 
const equalObjects = (jsonData1, jsonData2) => {
    const isValidJson = (data) => {
      // Check if data is a valid JSON
      if (typeof data === 'object') {
        try {
          JSON.stringify(data);
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return true;
      }
    };
  
    if (!isValidJson(jsonData1) || !isValidJson(jsonData2)) {
      throw new Error("Error encountered")
    }
  
    const isEqual = (data1, data2) => {
      // If both values are null or undefined, return true
      if (data1 === null && data2 === null) return true;
      if (data1 === undefined && data2 === undefined) return true;
  
      // If one value is null or undefined and the other is not, return false
      if (data1 === null || data1 === undefined) return false;
      if (data2 === null || data2 === undefined) return false;
  
      // If both values are not objects, compare them directly
      if (typeof data1 !== 'object' && typeof data2 !== 'object') {
        return data1 === data2;
      }
  
      // If one value is an object and the other is not, return false
      if (typeof data1 !== 'object' || typeof data2 !== 'object') {
        return false;
      }
  
      // If both values are arrays, compare them recursively
      if (Array.isArray(data1) && Array.isArray(data2)) {
        if (data1.length !== data2.length) return false;
        for (let i = 0; i < data1.length; i++) {
          if (!isEqual(data1[i], data2[i])) return false;
        }
        return true;
      }
  
      // If both values are objects, compare them recursively
      const keys1 = Object.keys(data1);
      const keys2 = Object.keys(data2);
      if (keys1.length !== keys2.length) return false;
      for (const key of keys1) {
        if (!isEqual(data1[key], data2[key])) return false;
      }
      return true;
    }
  
    return isEqual(jsonData1, jsonData2);
  };
  
  module.exports = { equalObjects };