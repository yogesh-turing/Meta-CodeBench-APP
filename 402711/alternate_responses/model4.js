class ComplexMathOperations {
    power(a, b) {
        if (a === 0 && b === 0) {
            throw new Error("0^0 is undefined");
        }
        if (a === 0) {
            return 0;
        }
        
        const absB = Math.abs(b);
        let result = 1;
        let base = a;
        
        while (absB > 0) {
            if (absB & 1) {
                result *= base;
            }
            base *= base;
            absB >>> 1;
        }
        
        return b < 0 ? 1 / result : result;
    }

    determinant3x3(matrix) {
        // Validate matrix dimensions
        if (!matrix || matrix.length !== 3 || 
            !matrix.every(row => row && row.length === 3)) {
            throw new Error("Matrix must be 3x3");
        }

        // Using Sarrus' rule for 3x3 determinant
        return (
            matrix[0][0] * matrix[1][1] * matrix[2][2] +
            matrix[0][1] * matrix[1][2] * matrix[2][0] +
            matrix[0][2] * matrix[1][0] * matrix[2][1] -
            matrix[0][2] * matrix[1][1] * matrix[2][0] -
            matrix[0][1] * matrix[1][0] * matrix[2][2] -
            matrix[0][0] * matrix[1][2] * matrix[2][1]
        );
    }

    solveLinearSystem(coefficients, constants) {
        const n = coefficients.length;
        if (!n || !constants || constants.length !== n ||
            !coefficients.every(row => row.length === n)) {
            throw new Error("Invalid input dimensions");
        }

        // Create augmented matrix
        const augMatrix = coefficients.map((row, i) => [...row, constants[i]]);

        // Gaussian elimination with partial pivoting
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxEl = Math.abs(augMatrix[i][i]);
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augMatrix[k][i]) > maxEl) {
                    maxEl = Math.abs(augMatrix[k][i]);
                    maxRow = k;
                }
            }

            if (maxEl === 0) {
                // Check if system has no solution or infinite solutions
                for (let k = i; k < n; k++) {
                    if (augMatrix[k][n] !== 0) {
                        throw new Error("No solution");
                    }
                }
                throw new Error("Infinite solutions");
            }

            // Swap maximum row with current row
            [augMatrix[i], augMatrix[maxRow]] = [augMatrix[maxRow], augMatrix[i]];

            // Make all rows below this one 0 in current column
            for (let k = i + 1; k < n; k++) {
                const c = -augMatrix[k][i] / augMatrix[i][i];
                for (let j = i; j <= n; j++) {
                    if (i === j) {
                        augMatrix[k][j] = 0;
                    } else {
                        augMatrix[k][j] += c * augMatrix[i][j];
                    }
                }
            }
        }

        // Back substitution
        const solution = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            solution[i] = augMatrix[i][n] / augMatrix[i][i];
            for (let k = i - 1; k >= 0; k--) {
                augMatrix[k][n] -= augMatrix[k][i] * solution[i];
            }
        }

        return solution;
    }
}

module.exports = {ComplexMathOperations};