var compareDataFrames = function (df1, df2) {
    if (df1.length != df2.length) throw new Error("DataFrames must have same number of columns.");
  
    var similarityScores = [];
  
    for (var i = 0; i < df1.length; i++) {
      var col1 = df1[i];
      var col2 = df2[i];
  
      if (col1.length != col2.length) throw new Error("Columns must have same number of rows.");
  
      if (!col1.length || !col2.length) {
        similarityScores.push(1.0);
        continue;
      }
  
      if (typeof col1[0] !== typeof col2[0]) {
        similarityScores.push(0.0);
        continue;
      }
  
      if (typeof col1[0] === "number" || typeof col1[0] === "boolean") {
        var normalizedCol1 = normalizeColumn(col1);
        var normalizedCol2 = normalizeColumn(col2);
  
        var distance = 0;
        for (var j = 0; j < normalizedCol1.length; j++) {
          distance += Math.pow(normalizedCol1[j] - normalizedCol2[j], 2);
        }
        distance = Math.sqrt(distance);
  
        similarityScores.push(1 / (1 + distance));
      } else if (typeof col1[0] === "string") {
        var differences = 0;
        for (var k = 0; k < col1.length; k++) {
          if (col1[k] !== col2[k]) differences++;
        }
        similarityScores.push((1.0 * (col1.length - differences)) / col1.length);
      } else {
        throw new Error("Unsupported data type: " + typeof col1[0]);
      }
    }
    return similarityScores;
  };
  
  var normalizeColumn = function (column) {
    if (!column.length) throw new Error("Column is empty.");
  
    var normalizedColumn = [];
  
    if (typeof column[0] === "number") {
      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;
  
      for (var i = 0; i < column.length; i++) {
        var num = column[i];
        min = Math.min(min, num);
        max = Math.max(max, num);
      }
  
      var range = max - min;
  
      for (var j = 0; j < column.length; j++) {
        var val = column[j];
        normalizedColumn.push(range > 0 ? (val - min) / range : 0.0);
      }
    } else if (typeof column[0] === "boolean") {
      for (var k = 0; k < column.length; k++) {
        normalizedColumn.push(column[k] ? 1.0 : 0.0);
      }
    } else {
      throw new Error("Unsupported data type: " + typeof column[0]);
    }
  
    return normalizedColumn;
  };
  
  module.exports = {
    DataFrameComparator: {
      compareDataFrames: compareDataFrames,
      normalizeColumn: normalizeColumn,
    },
  };