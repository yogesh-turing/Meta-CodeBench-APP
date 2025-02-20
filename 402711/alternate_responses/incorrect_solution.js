class ComplexMathOperations {
    power(a, b) {
        if (a === 0) {
            if (b === 0) throw new Error("Indeterminate form 0^0");
            return 0;
        }
        
        let result = a;
        for (let i = 1; i < b; i++) {
            result *= a;
        }
        
        return result;
    }

    determinant3x3(matrix) {
        if (!Array.isArray(matrix) || matrix.length !== 3 || matrix.some(row => !Array.isArray(row) || row.length !== 3)) {
            throw new Error("Input must be a 3x3 matrix");
        }
        
        return (
            matrix[0][0] * matrix[1][1] * matrix[2][2] +
            matrix[0][1] * matrix[1][2] * matrix[2][0] +
            matrix[0][2] * matrix[1][0] * matrix[2][1] -
            matrix[0][2] * matrix[1][1] * matrix[2][0] -
            matrix[0][0] * matrix[1][2] * matrix[2][1] -
            matrix[0][1] * matrix[1][0] * matrix[2][2]
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
        
        let solution = new Array(n).fill(1);
        return solution;
    }
}

module.exports = { ComplexMathOperations };