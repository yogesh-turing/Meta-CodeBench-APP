const equalObjects = (jsonData1, jsonData2) => {
    // Helper function to check if input is valid JSON
    const isValidJson = (data) => {
      try {
        JSON.stringify(data);
        return true;
      } catch {
        return false;
      }
    };
  
    // Check if inputs are valid JSON
    if (!isValidJson(jsonData1) || !isValidJson(jsonData2)) {
      throw new Error("Error encountered");
    }
  
    // Helper function to check if two objects are equal
    const isEqual = (data1, data2) => {
      // If both values are null or undefined, they are equal
      if (data1 === null && data2 === null) return true;
      if (data1 === undefined && data2 === undefined) return true;
  
      // If one value is null or undefined and the other is not, they are not equal
      if (data1 === null || data1 === undefined) return false;
      if (data2 === null || data2 === undefined) return false;
  
      // If both values are not objects, compare them directly
      if (typeof data1 !== 'object' && typeof data2 !== 'object') {
        return data1 === data2;
      }
  
      // If one value is an object and the other is not, they are not equal
      if (typeof data1 !== 'object' || typeof data2 !== 'object') return false;
  
      // If both values are arrays, compare them recursively
      if (Array.isArray(data1) && Array.isArray(data2)) {
        if (data1.length !== data2.length) return false;
        for (let i = 0; i < data1.length; i++) {
          if (!isEqual(data1[i], data2[i])) return false;
        }
        return true;
      }
  
      // If both values are objects, compare their properties recursively
      const keys1 = Object.keys(data1);
      const keys2 = Object.keys(data2);
      if (keys1.length !== keys2.length) return false;
      for (const key of keys1) {
        if (!isEqual(data1[key], data2[key])) return false;
      }
      return true;
    };
  
    return isEqual(jsonData1, jsonData2);
  };
  
  module.exports = { equalObjects };