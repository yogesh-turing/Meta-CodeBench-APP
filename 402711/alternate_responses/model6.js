class ComplexMathOperations {
    /**
     * Computes the power of a number (a^b) using an optimized approach.
     * Handle cases where b is negative and where a is zero.
     */
    power(a, b) {
        // Handle edge cases
        if (b < 0) {
            return 1 / this.power(a, -b);
        } else if (a === 0) {
            if (b > 0) {
                return 0;
            } else {
                throw new Error("Cannot raise zero to the power of zero");
            }
        }

        // Exponentiation by squaring
        let result = 1;
        while (b > 0) {
            if (b % 2 === 1) {
                result *= a;
            }
            a *= a;
            b = Math.floor(b / 2);
        }
        return result;
    }

    /**
     * Computes the determinant of a 3x3 matrix.
     * The matrix is represented as a 2D array of numbers.
     * Handle cases where the matrix is not 3x3 by throwing an error.
     */
    determinant3x3(matrix) {
        // Check if the matrix is 3x3
        if (matrix.length !== 3 || matrix[0].length !== 3) {
            throw new Error("Matrix must be 3x3");
        }

        // Calculate the determinant
        const a = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]);
        const b = matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]);
        const c = matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
        return a - b + c;
    }

    /**
     * Solves a system of linear equations using Gaussian elimination.
     * The system is represented as a 2D array (coefficients) and a 1D array (constants).
     * Return the solution as an array of numbers.
     * Handle cases where the system has no solution or infinite solutions by throwing an error.
     */
    solveLinearSystem(coefficients, constants) {
        // Check if the system is square (number of equations equals number of variables)
        if (coefficients.length !== constants.length) {
            throw new Error("System must be square");
        }

        // Perform Gaussian elimination
        const n = coefficients.length;
        for (let i = 0; i < n; i++) {
            // Search for maximum in this column
            let maxEl = Math.abs(coefficients[i][i]);
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(coefficients[k][i]) > maxEl) {
                    maxEl = Math.abs(coefficients[k][i]);
                    maxRow = k;
                }
            }

            // Swap maximum row with current row
            [coefficients[i], coefficients[maxRow]] = [coefficients[maxRow], coefficients[i]];
            [constants[i], constants[maxRow]] = [constants[maxRow], constants[i]];

            // Make all rows below this one 0 in current column
            for (let k = i + 1; k < n; k++) {
                const c = -coefficients[k][i] / coefficients[i][i];
                for (let j = i; j < n; j++) {
                    if (i === j) {
                        coefficients[k][j] = 0;
                    } else {
                        coefficients[k][j] += c * coefficients[i][j];
                    }
                }
                constants[k] += c * constants[i];
            }
        }

        // Solve equation Ax=b for an upper triangular matrix A
        const solution = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let k = i + 1; k < n; k++) {
                sum += coefficients[i][k] * solution[k];
            }
            if (coefficients[i][i] === 0) {
                if (constants[i] === 0) {
                    throw new Error("Infinite solutions");
                } else {
                    throw new Error("No solution");
                }
            }
            solution[i] = (constants[i] - sum) / coefficients[i][i];
        }
        return solution;
    }
}

module.exports = {ComplexMathOperations};