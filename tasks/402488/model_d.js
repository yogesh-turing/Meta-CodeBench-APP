const equalObjects = (jsonData1, jsonData2) => {
    const isValidJson = (data) => {
      try {
        // Check if data can be serialized to JSON
        JSON.stringify(data);
        return true;
      } catch {
        return false;
      }
    };
  
    if (!isValidJson(jsonData1) || !isValidJson(jsonData2)) {
      throw new Error("Error encountered");
    }
  
    const isEqual = (data1, data2) => {
      // Handle null and undefined
      if (data1 === data2) {
        return true;
      }
  
      // Check if types match
      if (typeof data1 !== typeof data2) {
        return false;
      }
  
      // Handle arrays
      if (Array.isArray(data1) && Array.isArray(data2)) {
        if (data1.length !== data2.length) {
          return false;
        }
        return data1.every((item, index) => isEqual(item, data2[index]));
      }
  
      // Handle objects
      if (typeof data1 === 'object' && data1 !== null && data2 !== null) {
        const keys1 = Object.keys(data1);
        const keys2 = Object.keys(data2);
  
        if (keys1.length !== keys2.length) {
          return false;
        }
  
        return keys1.every(key => 
          keys2.includes(key) && isEqual(data1[key], data2[key])
        );
      }
  
      // Handle primitives
      return data1 === data2;
    };
  
    return isEqual(jsonData1, jsonData2);
  };
  
  module.exports = { equalObjects };