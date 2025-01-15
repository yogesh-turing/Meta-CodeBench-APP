const equalObjects = (jsonData1, jsonData2) => {
  const isValidJson = (data) => {
    return typeof data === 'object' || typeof data === 'number' || typeof data === 'string' || typeof data === 'boolean' || data === null;
  };

  if (!isValidJson(jsonData1) || !isValidJson(jsonData2)) {
    throw new Error("Error encountered")
  }

  const isEqual = (data1, data2) => {
    if (typeof data1 !== typeof data2) {
      return false;
    }

    if (typeof data1 === 'object' && data1 !== null) {
      if (Array.isArray(data1)) {
        if (!Array.isArray(data2)) {
          return false;
        }

        if (data1.length !== data2.length) {
          return false;
        }

        for (let i = 0; i < data1.length; i++) {
          if (!isEqual(data1[i], data2[i])) {
            return false;
          }
        }

        return true;
      } else {
        const keys1 = Object.keys(data1);
        const keys2 = Object.keys(data2);

        if (keys1.length !== keys2.length) {
          return false;
        }

        for (let i = 0; i < keys1.length; i++) {
          if (!isEqual(data1[keys1[i]], data2[keys1[i]])) {
            return false;
          }
        }

        return true;
      }
    } else {
      return data1 === data2;
    }
  }

  return isEqual(jsonData1, jsonData2);
};

module.exports = { equalObjects };