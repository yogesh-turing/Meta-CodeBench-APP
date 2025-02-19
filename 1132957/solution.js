class DataFrameComparator {
    static compareDataFrames(df1, df2) {
      if (df1.length !== df2.length) {
        throw new Error("DataFrames must have the same number of columns.");
      }
  
      const similarityScores = [];
      for (let i = 0; i < df1.length; i++) {
        this.validateColumn(df1[i]);
        this.validateColumn(df2[i]);
        similarityScores.push(this.compareColumns(df1[i], df2[i]));
      }
      return similarityScores;
    }
  
    static validateColumn(column) {
      if (column.some((val) => val === undefined)) {
        throw new Error("Column contains undefined values.");
      }
  
      if (column.length > 0) {
        const firstType = typeof column[0];
        if (column.some((val) => typeof val !== firstType)) {
          throw new Error("Column contains mixed data types.");
        }
      }
    }
  
    static compareColumns(col1, col2) {
      if (col1.length !== col2.length) {
        throw new Error("Columns must have the same number of rows.");
      }
  
      if (!col1.length || !col2.length) {
        return 1.0;
      }
  
      if (col1.some((val) => val === null) || col2.some((val) => val === null)) {
        throw new Error("Columns contain null values.");
      }
  
      if (typeof col1[0] !== typeof col2[0]) {
        return 0.0;
      }
  
      if (typeof col1[0] === "string") {
        return this.compareStringColumns(col1, col2);
      } else if (typeof col1[0] === "number" || typeof col1[0] === "boolean") {
        return this.compareNumericBooleanColumns(col1, col2);
      } else {
        throw new Error(`Unsupported data type: ${typeof col1[0]}`);
      }
    }
  
    static compareStringColumns(col1, col2) {
      let differences = 0;
      for (let i = 0; i < col1.length; i++) {
        if (col1[i] !== col2[i]) differences++;
      }
      return (col1.length - differences) / col1.length;
    }
  
    static compareNumericBooleanColumns(col1, col2) {
      const normalizedCol1 = this.normalizeColumn(col1);
      const normalizedCol2 = this.normalizeColumn(col2);
  
      let sumSquaredDiff = 0;
      for (let i = 0; i < normalizedCol1.length; i++) {
        sumSquaredDiff += Math.pow(normalizedCol1[i] - normalizedCol2[i], 2);
      }
  
      // Calculate Euclidean distance
      const distance = Math.sqrt(sumSquaredDiff);
  
      // Convert distance to similarity score
      return 1 / (1 + distance);
    }
  
    static normalizeColumn(column) {
      if (!column.length) {
        throw new Error("Column is empty.");
      }
  
      const normalizedColumn = [];
  
      if (typeof column[0] === "number") {
        const min = Math.min(...column);
        const max = Math.max(...column);
        const range = max - min;
  
        for (const val of column) {
          normalizedColumn.push(range > 0 ? (val - min) / range : 0.0);
        }
      } else if (typeof column[0] === "boolean") {
        for (const val of column) {
          normalizedColumn.push(val ? 1.0 : 0.0);
        }
      } else {
        throw new Error(`Unsupported data type: ${typeof column[0]}`);
      }
  
      return normalizedColumn;
    }
  }
  
  module.exports = { DataFrameComparator };
  