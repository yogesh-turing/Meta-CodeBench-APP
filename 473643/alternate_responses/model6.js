class DataFrameComparator {
  static compareDataFrames(df1, df2) {
    if (df1.length !== df2.length) {
      throw new Error("DataFrames must have the same number of columns.");
    }

    const similarityScores = [];

    for (let i = 0; i < df1.length; i++) {
      const col1 = df1[i];
      const col2 = df2[i];

      const score = DataFrameComparator.compareColumns(col1, col2);
      similarityScores.push(score);
    }

    return similarityScores;
  }

  static compareColumns(col1, col2) {
    if (col1.length !== col2.length) {
      throw new Error("Columns must have the same number of rows.");
    }

    if (!col1.length || !col2.length) {
      return 1.0; // Empty columns are considered identical
    }

    if (typeof col1[0] !== typeof col2[0]) {
      throw new Error("Columns must have the same data type.");
    }

    if (typeof col1[0] === "string") {
      return DataFrameComparator.compareStringColumns(col1, col2);
    } else if (typeof col1[0] === "number" || typeof col1[0] === "boolean") {
      return DataFrameComparator.compareNumericBooleanColumns(col1, col2);
    } else {
      throw new Error(`Unsupported data type: ${typeof col1[0]}`);
    }
  }

  static compareStringColumns(col1, col2) {
    let differences = 0;

    for (let i = 0; i < col1.length; i++) {
      if (col1[i] !== col2[i]) {
        differences++;
      }
    }

    return (col1.length - differences) / col1.length;
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
    if (!column.length) {
      throw new Error("Column is empty.");
    }

    if (column.includes(null)) {
      throw new Error("Column cannot contain null values.");
    }

    const normalizedColumn = [];

    if (typeof column[0] === "number") {
      const min = Math.min(...column);
      const max = Math.max(...column);
      const range = max - min;

      for (let i = 0; i < column.length; i++) {
        const val = column[i];
        normalizedColumn.push(range > 0 ? (val - min) / range : 0.0);
      }
    } else if (typeof column[0] === "boolean") {
      for (let i = 0; i < column.length; i++) {
        normalizedColumn.push(column[i] ? 1.0 : 0.0);
      }
    } else {
      throw new Error(`Unsupported data type: ${typeof column[0]}`);
    }

    return normalizedColumn;
  }
}

module.exports = { DataFrameComparator };