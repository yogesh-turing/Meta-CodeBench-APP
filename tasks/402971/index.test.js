const {FormulaCalculator} = require('./incorrect');

describe('FormulaCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new FormulaCalculator();
    });

    describe('Variable Management', () => {
        test('should set and get variables correctly', () => {
            calculator.setVariable('x', 10);
            expect(calculator.getVariable('x')).toBe(10);
        });

        test('should throw error for undefined variables', () => {
            expect(() => calculator.getVariable('y')).toThrow();
        });

        test('should throw error for non-numeric values', () => {
            expect(() => calculator.setVariable('x', 'string')).toThrow();
            expect(() => calculator.setVariable('x', null)).toThrow();
            expect(() => calculator.setVariable('x', undefined)).toThrow();
            expect(() => calculator.setVariable('x', {})).toThrow();
        });
    });

    describe('Function Registration', () => {
        test('should register and use custom functions', () => {
            calculator.registerFunction('double', x => x * 2);
            calculator.setVariable('x', 5);
            expect(calculator.evaluate('double(x)')).toBe(10);
        });

        test('should throw error for invalid function registration', () => {
            expect(() => calculator.registerFunction('invalid', 'not a function')).toThrow();
            expect(() => calculator.registerFunction('invalid', null)).toThrow();
            expect(() => calculator.registerFunction('invalid', undefined)).toThrow();
            expect(() => calculator.registerFunction('invalid', 123)).toThrow();
        });
    });

    describe('Formula Evaluation', () => {
        beforeEach(() => {
            calculator.setVariable('x', 10);
            calculator.setVariable('y', 5);
            calculator.registerFunction('max', (a, b) => Math.max(a, b));
            calculator.registerFunction('min', (a, b) => Math.min(a, b));
            calculator.registerFunction('sum', (...args) => args.reduce((a, b) => a + b, 0));
            calculator.registerFunction('throwingFunc', () => { throw new Error(); });
            calculator.registerFunction('nested', (a) => a * 2);
        });

        test('should evaluate basic arithmetic', () => {
            expect(calculator.evaluate('2 + 3 * 4')).toBe(14);
            expect(calculator.evaluate('10 - 2 * 3')).toBe(4);
            expect(calculator.evaluate('8 / 2 + 3')).toBe(7);
            expect(calculator.evaluate('2 * 3 + 4 * 5')).toBe(26);
            expect(calculator.evaluate('2 * (3 + 4)')).toBe(14);
            expect(calculator.evaluate('(2 + 3) * 4')).toBe(20);
            expect(calculator.evaluate('2 * (3 + (4 * 5))')).toBe(46);
        });

        test('should evaluate expressions with variables', () => {
            expect(calculator.evaluate('x + y')).toBe(15);
            expect(calculator.evaluate('x * y')).toBe(50);
            expect(calculator.evaluate('x / y')).toBe(2);
            expect(calculator.evaluate('x - y')).toBe(5);
            expect(calculator.evaluate('(x + y) * 2')).toBe(30);
            expect(calculator.evaluate('x + (y * 2)')).toBe(20);
        });

        test('should handle decimal numbers', () => {
            expect(calculator.evaluate('2.5 + 3.7')).toBe(6.2);
            expect(calculator.evaluate('10.5 / 2')).toBe(5.25);
            expect(calculator.evaluate('3.14 * 2')).toBe(6.28);
            expect(calculator.evaluate('.5 + 1.5')).toBe(2);
            expect(calculator.evaluate('2 * .25')).toBe(0.5);
            expect(calculator.evaluate('0.1 + 0.2')).toBeCloseTo(0.3);
        });

        test('should handle empty or invalid input', () => {
            expect(() => calculator.evaluate('')).toThrow();
            expect(() => calculator.evaluate('   ')).toThrow();
            expect(() => calculator.evaluate(null)).toThrow();
            expect(() => calculator.evaluate(undefined)).toThrow();
            expect(() => calculator.evaluate(123)).toThrow();
            expect(() => calculator.evaluate({})).toThrow();
            expect(() => calculator.evaluate([])).toThrow();
            expect(() => calculator.evaluate('2 @ 3')).toThrow();
            expect(() => calculator.evaluate('2 # 3')).toThrow();
            expect(() => calculator.evaluate('2 3')).toThrow();
        });

        test('should handle function call edge cases', () => {
            expect(() => calculator.evaluate('max()')).toThrow();
            expect(() => calculator.evaluate('max(,)')).toThrow();
            expect(() => calculator.evaluate('max(1,)')).toThrow();
            expect(() => calculator.evaluate('max(,1)')).toThrow();
            expect(() => calculator.evaluate('max(1,,2)')).toThrow();
            expect(() => calculator.evaluate('max (x)')).toThrow();
            expect(() => calculator.evaluate('max')).toThrow();
            expect(() => calculator.evaluate('throwingFunc()')).toThrow();
            expect(() => calculator.evaluate('nonexistent(1)')).toThrow();
            expect(() => calculator.evaluate('max(1)(2)')).toThrow();
        });

        test('should handle operator edge cases', () => {
            expect(() => calculator.evaluate('2+')).toThrow();
            expect(() => calculator.evaluate('+2')).toThrow();
            expect(() => calculator.evaluate('2 + + 3')).toThrow();
            expect(() => calculator.evaluate('2 +')).toThrow();
            expect(() => calculator.evaluate('* 2')).toThrow();
            expect(() => calculator.evaluate('2 * * 3')).toThrow();
            expect(() => calculator.evaluate('2 + * 3')).toThrow();
            expect(() => calculator.evaluate('2 * / 3')).toThrow();
        });

        test('should handle parentheses edge cases', () => {
            expect(() => calculator.evaluate('(')).toThrow();
            expect(() => calculator.evaluate(')')).toThrow();
            expect(() => calculator.evaluate('()')).toThrow();
            expect(() => calculator.evaluate('((()))')).toThrow();
            expect(() => calculator.evaluate('2 + (3')).toThrow();
            expect(() => calculator.evaluate('(2 + 3')).toThrow();
            expect(() => calculator.evaluate('2 + 3)')).toThrow();
            expect(() => calculator.evaluate('(2)(3)')).toThrow();
            expect(() => calculator.evaluate('2(3)')).toThrow();
            expect(() => calculator.evaluate('(2+3)4')).toThrow();
        });

        test('should handle decimal point edge cases', () => {
            expect(() => calculator.evaluate('2..')).toThrow();
            expect(() => calculator.evaluate('..2')).toThrow();
            expect(() => calculator.evaluate('2.3.')).toThrow();
            expect(() => calculator.evaluate('.2.3')).toThrow();
            expect(() => calculator.evaluate('2.3.4')).toThrow();
            expect(() => calculator.evaluate('1.2.3')).toThrow();
        });

        test('should handle division by zero', () => {
            expect(() => calculator.evaluate('1/0')).toThrow();
            expect(() => calculator.evaluate('x/(y-5)')).toThrow();
            expect(() => calculator.evaluate('2/(1-1)')).toThrow();
            calculator.registerFunction('zero', () => 0);
            expect(() => calculator.evaluate('1/zero()')).toThrow();
        });

        test('should handle nested function calls', () => {
            expect(calculator.evaluate('max(sum(1,2), min(3,4))')).toBe(3);
            expect(calculator.evaluate('sum(max(1,2), min(3,4), 5)')).toBe(10);
            expect(calculator.evaluate('nested(sum(1,2))')).toBe(6);
            expect(calculator.evaluate('max(nested(2), nested(3))')).toBe(6);
        });

        test('should handle complex function argument cases', () => {
            expect(() => calculator.evaluate('max((1+2),()')).toThrow();
            expect(() => calculator.evaluate('max((),())')).toThrow();
            expect(() => calculator.evaluate('max((1+2),())')).toThrow();
            expect(() => calculator.evaluate('max(1+,2)')).toThrow();
            expect(() => calculator.evaluate('max(1,)+2')).toThrow();
            expect(() => calculator.evaluate('max((()))')).toThrow();
            expect(() => calculator.evaluate('max((1+2,))')).toThrow();
            expect(() => calculator.evaluate('max((,1+2))')).toThrow();
            expect(() => calculator.evaluate('max((1+2),(,))')).toThrow();
            expect(() => calculator.evaluate('max((1+2),())')).toThrow();
            expect(() => calculator.evaluate('max((),())')).toThrow();
        });

        test('should handle operator precedence edge cases', () => {
            expect(calculator.evaluate('2 * 3 + 4 * 5')).toBe(26);
            expect(calculator.evaluate('2 + 3 * 4 + 5')).toBe(19);
            expect(calculator.evaluate('2 * 3 / 4 * 5')).toBe(7.5);
            expect(calculator.evaluate('1 + 2 * 3 + 4 * 5 + 6')).toBe(33);
            expect(() => calculator.evaluate('2 * / 3')).toThrow();
            expect(() => calculator.evaluate('* / 2')).toThrow();
            expect(() => calculator.evaluate('2 * 3 /')).toThrow();
        });

        test('should handle error propagation', () => {
            expect(() => calculator.evaluate('throwingFunc()')).toThrow();
            expect(() => calculator.evaluate('max(throwingFunc(), 2)')).toThrow();
            expect(() => calculator.evaluate('1 + throwingFunc()')).toThrow();
            expect(() => calculator.evaluate('(throwingFunc())')).toThrow();
        });

        test('should handle function argument validation', () => {
            expect(() => calculator.evaluate('max(,)')).toThrow();
            expect(() => calculator.evaluate('max(1,)')).toThrow();
            expect(() => calculator.evaluate('max(,1)')).toThrow();
            expect(() => calculator.evaluate('max(())')).toThrow();
            expect(() => calculator.evaluate('max((,))')).toThrow();
            expect(() => calculator.evaluate('max(1,,2)')).toThrow();
            expect(() => calculator.evaluate('max((1,))')).toThrow();
            expect(() => calculator.evaluate('max((,1))')).toThrow();
        });

        test('should handle operator stack validation', () => {
            expect(() => calculator.evaluate('1 + (')).toThrow();
            expect(() => calculator.evaluate('(1 + 2')).toThrow();
            expect(() => calculator.evaluate('1 + 2)')).toThrow();
            expect(() => calculator.evaluate('((1 + 2)')).toThrow();
            expect(() => calculator.evaluate('(1 + 2))')).toThrow();
            expect(() => calculator.evaluate('1 + (2 * )')).toThrow();
            expect(() => calculator.evaluate('1 + (2 * ())')).toThrow();
        });

        test('should handle complex nested expressions with errors', () => {
            expect(() => calculator.evaluate('max(1, (2 + ))')).toThrow();
            expect(() => calculator.evaluate('sum(1, (2 * ), 3)')).toThrow();
            expect(() => calculator.evaluate('nested((1 + ))')).toThrow();
            expect(() => calculator.evaluate('max(1, ())')).toThrow();
            expect(() => calculator.evaluate('max((), 1)')).toThrow();
            expect(() => calculator.evaluate('1 + ()')).toThrow();
            expect(() => calculator.evaluate('() + 1')).toThrow();
        });

        test('should handle invalid token sequences', () => {
            expect(() => calculator.evaluate('1 2')).toThrow();
            expect(() => calculator.evaluate('1 + 2 3')).toThrow();
            expect(() => calculator.evaluate('1 2 +')).toThrow();
            expect(() => calculator.evaluate('1 + * 2')).toThrow();
            expect(() => calculator.evaluate('1 * + 2')).toThrow();
            expect(() => calculator.evaluate('1 + 2 *')).toThrow();
        });
    });
});
