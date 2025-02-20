class DataFrameComparator {
    static compareDataFrames(df1, df2) {
      if (df1.length !== df2.length) {
        throw new Error("DataFrames must have the same number of columns.");
      }
  
      const similarityScores = [];
  
      for (let i = 0; i < df1.length; i++) {
        const col1 = df1[i];
        const col2 = df2[i];
  
        if (col1.length !== col2.length) {
          throw new Error("Columns must have the same number of rows.");
        }
  
        similarityScores.push(DataFrameComparator.compareColumns(col1, col2));
      }
  
      return similarityScores;
    }
  
    static compareColumns(col1, col2) {
      if (col1.length !== col2.length) {
        throw new Error("Columns must have the same number of rows.");
      }
  
      if (col1.length === 0) {
        return 1.0;
      }
  
      if (typeof col1[0] !== typeof col2[0]) {
        throw new Error("Columns must have the same data type.");
      }
  
      if (typeof col1[0] === "string") {
        return DataFrameComparator.compareStringColumns(col1, col2);
      } else if (typeof col1[0] === "number" || typeof col1[0] === "boolean") {
        return DataFrameComparator.compareNumericBooleanColumns(col1, col2);
      } else {
        throw new Error("Unsupported data type: " + typeof col1[0]);
      }
    }
  
    static compareStringColumns(col1, col2) {
      let differences = 0;
      for (let i = 0; i < col1.length; i++) {
        if (col1[i] !== col2[i]) {
          differences++;
        }
      }
      return (1.0 * (col1.length - differences)) / col1.length;
    }
  
    static compareNumericBooleanColumns(col1, col2) {
      const normalizedCol1 = DataFrameComparator.normalizeColumn(col1);
      const normalizedCol2 = DataFrameComparator.normalizeColumn(col2);
  
      let distance = 0;
      for (let i = 0; i < normalizedCol1.length; i++) {
        distance += Math.pow(normalizedCol1[i] - normalizedCol2[i], 2);
      }
      distance = Math.sqrt(distance);
  
      return 1 / (1 + distance);
    }
  
    static normalizeColumn(column) {
      if (column.length === 0) {
        throw new Error("Column is empty.");
      }
  
      if (column.includes(null)) {
        throw new Error("Column contains null value.");
      }
  
      if (typeof column[0] === "number") {
        const min = Math.min(...column);
        const max = Math.max(...column);
        const range = max - min;
  
        return column.map(val => (range > 0 ? (val - min) / range : 0.0));
      } else if (typeof column[0] === "boolean") {
        return column.map(val => (val ? 1.0 : 0.0));
      } else {
        throw new Error("Unsupported data type: " + typeof column[0]);
      }
    }
  }
  
  module.exports = { DataFrameComparator };