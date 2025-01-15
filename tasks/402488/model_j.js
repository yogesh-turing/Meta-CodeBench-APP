const equalObjects = (jsonData1, jsonData2) => {
    const isValidJson = (data) => {
      return typeof data === 'object' || Array.isArray(data) || typeof data === 'number' || typeof data === 'string' || typeof data === 'boolean' || data === null;
    };
  
    if (!isValidJson(jsonData1) || !isValidJson(jsonData2)) {
      throw new Error("Error encountered");
    }
  
    const isEqual = (data1, data2) => {
      if (typeof data1 !== typeof data2) {
        return false;
      }
  
      if (Array.isArray(data1)) {
        if (data1.length !== data2.length) {
          return false;
        }
  
        for (let i = 0; i < data1.length; i++) {
          if (!isEqual(data1[i], data2[i])) {
            return false;
          }
        }
  
        return true;
      } else if (typeof data1 === 'object') {
        if (Object.keys(data1).length !== Object.keys(data2).length) {
          return false;
        }
  
        for (const key in data1) {
          if (!isEqual(data1[key], data2[key])) {
            return false;
          }
        }
  
        return true;
      } else {
        return data1 === data2;
      }
    }
  
    return isEqual(jsonData1, jsonData2);
  };
  
  module.exports = { equalObjects };