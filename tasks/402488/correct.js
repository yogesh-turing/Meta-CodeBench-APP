const equalObjects = (jsonData1, jsonData2) => {
    const isValidJson = (data) => {
      try {
        JSON.parse(JSON.stringify(data));
        return true;
      } catch (e) {
        return false;
      }
    };
  
    if (!isValidJson(jsonData1) || !isValidJson(jsonData2)) {
      throw new Error("Error encountered");
    }
  
    const isEqual = (data1, data2) => {
      // Check if types are different
      if (typeof data1 !== typeof data2) {
        return false;
      }
  
      // Handle null
      if (data1 === null && data2 === null) {
        return true;
      }
  
      // Handle primitives
      if (typeof data1 !== 'object') {
        return data1 === data2;
      }
  
      // Handle arrays
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
  
      // Handle objects
      if (!Array.isArray(data1) && !Array.isArray(data2)) {
        const keys1 = Object.keys(data1);
        const keys2 = Object.keys(data2);
  
        if (keys1.length !== keys2.length) {
          return false;
        }
  
        for (let key of keys1) {
          if (!keys2.includes(key) || !isEqual(data1[key], data2[key])) {
            return false;
          }
        }
        return true;
      }
  
      // If we reach here, the structures are different
      return false;
    };
  
    return isEqual(jsonData1, jsonData2);
  };
  
  module.exports = { equalObjects };