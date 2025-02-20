class DataAggregator {
    constructor() {
      this.data = [];
      this.requiredFields = ["id", "timestamp", "value"];
    }
  
    addDataPoint(dataPoint) {
      // Validate required fields
      for (const field of this.requiredFields) {
        if (!(field in dataPoint)) {
          throw new Error(`Field '${field}' is required`);
        }
      }
      // Prevent duplicate entries or replace with a newer timestamp
      const existingIndex = this.data.findIndex(d => d.id === dataPoint.id);
      if (existingIndex !== -1) {
        if (dataPoint.timestamp > this.data[existingIndex].timestamp) {
          this.data.splice(existingIndex, 1);
        } else {
          return;
        }
      }
      // Insert while keeping data sorted by timestamp (using binary search)
      let left = 0, right = this.data.length;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (this.data[mid].timestamp < dataPoint.timestamp) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      this.data.splice(left, 0, dataPoint);
    }
  
    checkCondition(fieldValue, condition) {
      const operator = condition.charAt(0);
      const value = parseFloat(condition.slice(1));
      switch (operator) {
        case ">":
          return fieldValue > value;
        case "<":
          return fieldValue < value;
        case "=":
          return fieldValue === value;
        default:
          return false;
      }
    }
  
    // Convert a condition into an array.
    parseConditions(cond) {
      if (Array.isArray(cond)) return cond;
      if (typeof cond === "string" && cond.includes(",")) {
        return cond.split(",").map(s => s.trim());
      }
      return [cond];
    }
  
    // Apply filters sequentially, field by field.
    getAggregatedData(query) {
      if (!query || !query.filter) {
        return { error: "Invalid query structure" };
      }
  
      let filteredData = this.data.slice();
      let validFieldFound = false;
  
      // Process each filter field.
      for (const field in query.filter) {
        // Only apply filter if at least one data point contains the field.
        if (this.data.some(item => field in item)) {
          validFieldFound = true;
          const conditions = this.parseConditions(query.filter[field]);
          filteredData = filteredData.filter(item =>
            conditions.every(cond => this.checkCondition(item[field], cond))
          );
        }
      }
  
      if (!validFieldFound) {
        return { error: "Non-existent fields" };
      }
  
      if (query.aggregate && Array.isArray(query.aggregate)) {
        const values = filteredData.map(item => item.value);
        const result = {};
        query.aggregate.forEach(agg => {
          switch (agg.toLowerCase()) {
            case "sum":
              result.sum = values.reduce((a, b) => a + b, 0);
              break;
            case "min":
              result.min = Math.min(...values);
              break;
            case "max":
              result.max = Math.max(...values);
              break;
            case "average":
              result.average =
                values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
              break;
          }
        });
        return result;
      }
  
      return filteredData;
    }
  }
  
  module.exports = { DataAggregator };