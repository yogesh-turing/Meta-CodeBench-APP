class ComplexMathOperations {
  power(a, b) {
      if (a === 0) {
          if (b === 0) throw new Error("Indeterminate form 0^0");
          return 0;
      }
      
      let exponent = Math.abs(b);
      let result = 1;
      let base = a;
      
      while (exponent > 0) {
          if (exponent % 2 === 1) {
              result *= base;
          }
          base *= base;
          exponent = Math.floor(exponent / 2);
      }
      
      return b < 0 ? 1 / result : result;
  }

  determinant3x3(matrix) {
      if (!Array.isArray(matrix) || matrix.length !== 3 || matrix.some(row => !Array.isArray(row) || row.length !== 3)) {
          throw new Error("Input must be a 3x3 matrix");
      }
      
      return (
          matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
          matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
          matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
      );
  }

  solveLinearSystem(coefficients, constants) {
      const n = coefficients.length;
      if (!Array.isArray(coefficients) || !Array.isArray(constants) || coefficients.length !== constants.length) {
          throw new Error("Invalid input dimensions");
      }
      
      for (let i = 0; i < n; i++) {
          if (!Array.isArray(coefficients[i]) || coefficients[i].length !== n) {
              throw new Error("Invalid matrix dimensions");
          }
      }
      
      let augmentedMatrix = coefficients.map((row, i) => [...row, constants[i]]);
      
      for (let i = 0; i < n; i++) {
          let maxRow = i;
          for (let k = i + 1; k < n; k++) {
              if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
                  maxRow = k;
              }
          }
          
          [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
          
          if (augmentedMatrix[i][i] === 0) {
              throw new Error("No solution");
          }
          
          for (let k = i + 1; k < n; k++) {
              let factor = augmentedMatrix[k][i] / augmentedMatrix[i][i];
              for (let j = i; j <= n; j++) {
                  augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
              }
          }
      }
      
      let solution = new Array(n).fill(0);
      for (let i = n - 1; i >= 0; i--) {
          let sum = augmentedMatrix[i][n];
          for (let j = i + 1; j < n; j++) {
              sum -= augmentedMatrix[i][j] * solution[j];
          }
          solution[i] = sum / augmentedMatrix[i][i];
      }
      
      return solution.map(value => parseFloat(value.toFixed(6)));
  }
}

module.exports = { ComplexMathOperations };