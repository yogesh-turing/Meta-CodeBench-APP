class ComplexMathOperations {
    /**
     * Computes the power of a number (a^b) using exponentiation by squaring.
     * Handles cases where b is negative and where a is zero.
     */
    power(a, b) {
        // Handle edge case where a is 0
        if (a === 0) {
            if (b > 0) return 0;
            if (b === 0) throw new Error("Cannot raise zero to the power of zero");
            if (b < 0) throw new Error("Cannot divide by zero");
        }

        // Use exponentiation by squaring for efficiency
        let result = 1;
        while (b !== 0) {
            if (b % 2 !== 0) result *= a;
            a *= a;
            b = Math.floor(b / 2);
        }

        // Handle negative exponent
        if (b < 0) return 1 / result;
        return result;
    }

    /**
     * Computes the determinant of a 3x3 matrix.
     * The matrix is represented as a 2D array of numbers.
     * Throws an error if the matrix is not 3x3.
     */
    determinant3x3(matrix) {
        // Check if matrix is 3x3
        if (matrix.length !== 3 || matrix[0].length !== 3) {
            throw new Error("Matrix must be 3x3");
        }

        // Calculate determinant using cofactor expansion
        const det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
                    matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                    matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
        return det;
    }

    /**
     * Solves a system of linear equations using Gaussian elimination.
     * The system is represented as a 2D array (coefficients) and a 1D array (constants).
     * Returns the solution as an array of numbers.
     * Throws an error if the system has no solution or infinite solutions.
     */
    solveLinearSystem(coefficients, constants) {
        // Check if coefficients and constants have the same length
        if (coefficients.length !== constants.length) {
            throw new Error("Coefficients and constants must have the same length");
        }

        // Perform Gaussian elimination
        for (let i = 0; i < coefficients.length - 1; i++) {
            // Find pivot row
            let pivotRow = i;
            while (pivotRow < coefficients.length && coefficients[pivotRow][i] === 0) {
                pivotRow++;
            }
            if (pivotRow === coefficients.length) {
                throw new Error("No solution");
            }

            // Swap pivot row with current row
            [coefficients[i], coefficients[pivotRow]] = [coefficients[pivotRow], coefficients[i]];
            [constants[i], constants[pivotRow]] = [constants[pivotRow], constants[i]];

            // Eliminate variable from other rows
            for (let j = i + 1; j < coefficients.length; j++) {
                const factor = coefficients[j][i] / coefficients[i][i];
                for (let k = i; k < coefficients[j].length; k++) {
                    coefficients[j][k] -= factor * coefficients[i][k];
                }
                constants[j] -= factor * constants[i];
            }
        }

        // Check for infinite solutions
        if (coefficients[coefficients.length - 1][coefficients.length - 1] === 0) {
            throw new Error("Infinite solutions");
        }

        // Back-substitute to find solution
        const solution = new Array(coefficients.length);
        for (let i = coefficients.length - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < coefficients.length; j++) {
                sum += coefficients[i][j] * solution[j];
            }
            solution[i] = (constants[i] - sum) / coefficients[i][i];
        }

        return solution;
    }
}

module.exports = { ComplexMathOperations };