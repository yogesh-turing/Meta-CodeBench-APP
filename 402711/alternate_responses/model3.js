class ComplexMathOperations {
    power(a, b) {
        if (a === 0 && b === 0) {
            throw new Error("0^0 is undefined");
        }
        if (a === 0) {
            return 0;
        }
        
        let isNegative = b < 0;
        b = Math.abs(b);
        
        let result = 1;
        let base = a;
        
        while (b > 0) {
            if (b % 2 === 1) {
                result *= base;
            }
            base *= base;
            b = Math.floor(b / 2);
        }
        
        return isNegative ? 1 / result : result;
    }

    determinant3x3(matrix) {
        // Check if matrix is 3x3
        if (!matrix || matrix.length !== 3 || 
            !matrix.every(row => row && row.length === 3)) {
            throw new Error("Matrix must be 3x3");
        }

        // Using Sarrus' rule
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
                // Check if row is all zeros except constant
                const hasNoSolution = augMatrix[maxRow].slice(i).some((val, idx) => 
                    idx < n && Math.abs(val) > 1e-10);
                if (hasNoSolution) {
                    throw new Error("No solution");
                } else {
                    throw new Error("Infinite solutions");
                }
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