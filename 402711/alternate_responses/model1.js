class ComplexMathOperations {
    power(a, b) {
        if (a === 0) {
            if (b <= 0) throw new Error("Zero raised to zero or negative power is undefined");
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
            !matrix.every(row => Array.isArray(row) && row.length === 3)) {
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
            let maxRow = i;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(augMatrix[j][i]) > Math.abs(augMatrix[maxRow][i])) {
                    maxRow = j;
                }
            }

            // Check for no solution
            if (Math.abs(augMatrix[maxRow][i]) < 1e-10) {
                // Check if the rest of the row is zero
                const hasNonZero = augMatrix[maxRow].slice(i).some(val => Math.abs(val) > 1e-10);
                if (hasNonZero) throw new Error("No solution");
                throw new Error("Infinite solutions");
            }

            // Swap rows if necessary
            if (maxRow !== i) {
                [augMatrix[i], augMatrix[maxRow]] = [augMatrix[maxRow], augMatrix[i]];
            }

            // Eliminate column
            for (let j = i + 1; j < n; j++) {
                const factor = augMatrix[j][i] / augMatrix[i][i];
                for (let k = i; k <= n; k++) {
                    augMatrix[j][k] -= factor * augMatrix[i][k];
                }
            }
        }

        // Back substitution
        const solution = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += augMatrix[i][j] * solution[j];
            }
            solution[i] = (augMatrix[i][n] - sum) / augMatrix[i][i];
        }

        return solution;
    }
}

module.exports = {ComplexMathOperations};