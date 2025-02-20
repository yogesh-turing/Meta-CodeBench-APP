const { ComplexMathOperations } = require('./solution');

describe('ComplexMathOperations', () => {
    let mathOps = new ComplexMathOperations();

    // Power function tests
    test('power function with positive exponent', () => {
        expect(mathOps.power(2, 3)).toBe(8);
    });

    test('power function with zero exponent', () => {
        expect(mathOps.power(5, 0)).toBe(1);
    });

    test('power function with negative exponent', () => {
        expect(mathOps.power(2, -3)).toBeCloseTo(0.125);
    });

    test('power function with zero base and positive exponent', () => {
        expect(mathOps.power(0, 3)).toBe(0);
    });

    test('power function with zero base and zero exponent', () => {
        expect(() => mathOps.power(0, 0)).toThrow("Indeterminate form 0^0");
    });

    test('power function with negative base and even exponent', () => {
        expect(mathOps.power(-2, 4)).toBe(16);
    });

    test('power function with negative base and odd exponent', () => {
        expect(mathOps.power(-2, 3)).toBe(-8);
    });

    test('power function with large exponent', () => {
        expect(mathOps.power(2, 10)).toBe(1024);
    });

    // Determinant function tests
    test('determinant of identity matrix', () => {
        expect(mathOps.determinant3x3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])).toBe(1);
    });

    test('determinant of a singular matrix', () => {
        expect(mathOps.determinant3x3([
            [2, 4, 1],
            [1, 2, 0.5],
            [3, 6, 1.5]
        ])).toBe(0);
    });

    test('determinant function throws error for non-3x3 matrix', () => {
        expect(() => mathOps.determinant3x3([[1, 2], [3, 4]])).toThrow("Input must be a 3x3 matrix");
    });

    test('solve a system with no solution', () => {
        expect(() => mathOps.solveLinearSystem(
            [[1, 1], [2, 2]],
            [2, 5]
        )).toThrow("No solution");
    });

    test('solve a system with infinite solutions', () => {
        expect(() => mathOps.solveLinearSystem(
            [[1, 1], [2, 2]],
            [2, 4]
        )).toThrow("No solution");
    });
});