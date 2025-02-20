class ComplexMathOperations {
    /**
     * Computes the power of a number (a^b) using an optimized approach.
     * Handle cases where b is negative and where a is zero.
     */
    power(a, b) {
        // Handle edge case where a is 0
        if (a === 0) {
            if (b > 0) {
                return 0;
            } else if (b === 0) {
                throw new Error("Cannot raise zero to the power of zero");
            } else {
                throw new Error("Cannot raise zero to a negative power");
            }
        }

        // Handle edge case where b is negative
        if (b < 0) {
            return 1 / this.power(a, -b);
        }

        // Use exponentiation by squaring
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
            throw new Error("Matrix is not 3x3");
        }

        // Calculate the determinant using the formula for 3x3 matrices
        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[0][2];
        const d = matrix[1][0];
        const e = matrix[1][1];
        const f = matrix[1][2];
        const g = matrix[2][0];
        const h = matrix[2][1];
        const i = matrix[2][2];

        return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }

    /**
     * Solves a system of linear equations using Gaussian elimination.
     * The system is represented as a 2D array (coefficients) and a 1D array (constants).
     * Return the solution as an array of numbers.
     * Handle cases where the system has no solution or infinite solutions by throwing an error.
     */
    solveLinearSystem(coefficients, constants) {
        // Check if the number of equations matches the number of variables
        if (coefficients.length !== constants.length) {
            throw new Error("Number of equations does not match the number of variables");
        }

        // Create an augmented matrix
        const augmentedMatrix = coefficients.map((row, index) => [...row, constants[index]]);

        // Perform Gaussian elimination
        for (let i = 0; i < augmentedMatrix.length; i++) {
            // Search for a row with a non-zero coefficient in the current column
            let swapIndex = i;
            while (swapIndex < augmentedMatrix.length && augmentedMatrix[swapIndex][i] === 0) {
                swapIndex++;
            }

            // If no row with a non-zero coefficient is found, the system has no solution
            if (swapIndex === augmentedMatrix.length) {
                throw new Error("No solution");
            }

            // Swap the rows if necessary
            if (swapIndex !== i) {
                [augmentedMatrix[i], augmentedMatrix[swapIndex]] = [augmentedMatrix[swapIndex], augmentedMatrix[i]];
            }

            // Make the coefficient in the current column equal to 1
            const coefficient = augmentedMatrix[i][i];
            augmentedMatrix[i] = augmentedMatrix[i].map((value) => value / coefficient);

            // Eliminate the variable from the other equations
            for (let j = 0; j < augmentedMatrix.length; j++) {
                if (j !== i) {
                    const factor = augmentedMatrix[j][i];
                    augmentedMatrix[j] = augmentedMatrix[j].map((value, index) => value - factor * augmentedMatrix[i][index]);
                }
            }
        }

        // Check for infinite solutions
        if (augmentedMatrix.some((row) => row.every((value) => value === 0))) {
            throw new Error("Infinite solutions");
        }

        // Extract the solution from the augmented matrix
        return augmentedMatrix.map((row) => row[row.length - 1]);
    }
}

module.exports = { ComplexMathOperations };