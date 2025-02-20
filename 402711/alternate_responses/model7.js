class ComplexMathOperations {
    /**
     * Computes the power of a number (a^b) using an optimized approach.
     * Handle cases where b is negative and where a is zero.
     */
    power(a, b) {
        if (a === 0) {
            if (b > 0) {
                return 0;
            } else if (b === 0) {
                throw new Error("Cannot raise zero to the power of zero");
            } else {
                throw new Error("Cannot raise zero to a negative power");
            }
        }

        if (b < 0) {
            return 1 / this.power(a, -b);
        }

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
        if (matrix.length !== 3 || matrix[0].length !== 3 || matrix[1].length !== 3 || matrix[2].length !== 3) {
            throw new Error("Matrix must be 3x3");
        }

        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[0][2];
        const d = matrix[1][0];
        const e = matrix[1][1];
        const f = matrix[1][2];
        const g = matrix[2][0];
        const h = matrix[2][1];
        const i = matrix[2][2];

        return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
    }

    /**
     * Solves a system of linear equations using Gaussian elimination.
     * The system is represented as a 2D array (coefficients) and a 1D array (constants).
     * Return the solution as an array of numbers.
     * Handle cases where the system has no solution or infinite solutions by throwing an error.
     */
    solveLinearSystem(coefficients, constants) {
        if (coefficients.length !== constants.length) {
            throw new Error("Number of equations must match the number of variables");
        }

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
                let c = -coefficients[k][i] / coefficients[i][i];
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
        let x = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = constants[i] / coefficients[i][i];
            for (let k = i - 1; k >= 0; k--) {
                constants[k] -= coefficients[k][i] * x[i];
            }
        }

        // Check for infinite solutions
        for (let i = 0; i < n; i++) {
            if (coefficients[i][i] === 0) {
                throw new Error("Infinite solutions");
            }
        }

        return x;
    }
}

module.exports = {ComplexMathOperations};