const { MolarMassCalculator } = require('./solution');

describe('MolarMassCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new MolarMassCalculator();
    });

    // Success cases
    test('should calculate simple molecules correctly', () => {
        expect(calculator.calculate('H2')).toBe(2);
        expect(calculator.calculate('O2')).toBe(32);
        expect(calculator.calculate('N2')).toBe(28);
        expect(calculator.calculate('Cl2')).toBe(70);
    });

    test('should calculate compounds with single elements correctly', () => {
        expect(calculator.calculate('H2O')).toBe(18);
        expect(calculator.calculate('CO2')).toBe(44);
        expect(calculator.calculate('NH3')).toBe(17);
        expect(calculator.calculate('CH4')).toBe(16);
    });

    test('should handle compounds with multiple elements correctly', () => {
        expect(calculator.calculate('NaOH')).toBe(40);
        expect(calculator.calculate('H2SO4')).toBe(98);
        expect(calculator.calculate('Ca(OH)2')).toBe(74);
        expect(calculator.calculate('NaCl')).toBe(58);
    });

    test('should handle complex molecules with nested parentheses', () => {
        expect(calculator.calculate('(NH4)2SO4')).toBe(132);
        expect(calculator.calculate('Cu(NO3)2')).toBe(188);
        expect(calculator.calculate('Fe(ClO4)3')).toBe(353);
        expect(calculator.calculate('(NH4)3PO4')).toBe(149);
    });

    test('should handle multiple nested parentheses', () => {
        expect(calculator.calculate('((CH3)3Si)2NH')).toBe(161);
        expect(calculator.calculate('(Cu(NH3)4)SO4')).toBe(228);
        expect(calculator.calculate('((H2N)2CO)2')).toBe(120);
    });

    test('should handle single elements and groups', () => {
        expect(calculator.calculate('H')).toBe(1);
        expect(calculator.calculate('Na')).toBe(23);
        expect(calculator.calculate('(OH)')).toBe(17);
        expect(calculator.calculate('(H2O)')).toBe(18);
    });

    test('should handle elements with lowercase letters', () => {
        expect(calculator.calculate('He')).toBe(4);
        expect(calculator.calculate('Fe')).toBe(56);
        expect(calculator.calculate('Au')).toBe(197);
        expect(calculator.calculate('(He)2')).toBe(8);
    });

    test('should handle compounds with large numbers', () => {
        expect(calculator.calculate('Fe2O3')).toBe(160);
        expect(calculator.calculate('Al2(SO4)3')).toBe(342);
        expect(calculator.calculate('K4Fe(CN)6')).toBe(368);
        expect(calculator.calculate('Fe100')).toBe(5600);
        expect(calculator.calculate('(OH)100')).toBe(1700);
    });

    // Error cases - all should just throw an error
    test('should throw for invalid input types', () => {
        expect(() => calculator.calculate(null)).toThrow();
        expect(() => calculator.calculate(undefined)).toThrow();
        expect(() => calculator.calculate(123)).toThrow();
        expect(() => calculator.calculate('')).toThrow();
        expect(() => calculator.calculate({})).toThrow();
        expect(() => calculator.calculate([])).toThrow();
    });

    test('should throw for invalid characters', () => {
        expect(() => calculator.calculate('H2O#')).toThrow();
        expect(() => calculator.calculate('H@2O')).toThrow();
        expect(() => calculator.calculate('H2O$')).toThrow();
        expect(() => calculator.calculate('H2O_')).toThrow();
        expect(() => calculator.calculate('H2O.')).toThrow();
        expect(() => calculator.calculate('H2O/')).toThrow();
    });

    test('should throw for invalid element symbols', () => {
        expect(() => calculator.calculate('Xx')).toThrow();
        expect(() => calculator.calculate('Xyz')).toThrow();
        expect(() => calculator.calculate('Aa')).toThrow();
        expect(() => calculator.calculate('Zz')).toThrow();
    });

    test('should throw for malformed parentheses', () => {
        expect(() => calculator.calculate('((H2O)')).toThrow();
        expect(() => calculator.calculate('(H2O))')).toThrow();
        expect(() => calculator.calculate('((())')).toThrow();
        expect(() => calculator.calculate('())')).toThrow();
        expect(() => calculator.calculate('(()')).toThrow();
        expect(() => calculator.calculate(')H2O(')).toThrow();
    });

    test('should throw for empty or invalid groups', () => {
        expect(() => calculator.calculate('()')).toThrow();
        expect(() => calculator.calculate('()2')).toThrow();
        expect(() => calculator.calculate('(2)')).toThrow();
        expect(() => calculator.calculate('(#)')).toThrow();
        expect(() => calculator.calculate('(())')).toThrow();
        expect(() => calculator.calculate('((()))')).toThrow();
    });

    test('should throw for invalid formula starts', () => {
        expect(() => calculator.calculate('1H2O')).toThrow();
        expect(() => calculator.calculate('2NaCl')).toThrow();
        expect(() => calculator.calculate('#H2O')).toThrow();
        expect(() => calculator.calculate('.H2O')).toThrow();
        expect(() => calculator.calculate('_H2O')).toThrow();
        expect(() => calculator.calculate(' H2O')).toThrow();
    });

    test('should throw for invalid characters in groups', () => {
        expect(() => calculator.calculate('(H2O#)')).toThrow();
        expect(() => calculator.calculate('(Na@Cl)')).toThrow();
        expect(() => calculator.calculate('(H2O.)')).toThrow();
        expect(() => calculator.calculate('(H2O_)')).toThrow();
        expect(() => calculator.calculate('(H2O$)')).toThrow();
    });

    test('should throw for invalid characters after valid elements', () => {
        expect(() => calculator.calculate('Na@Cl')).toThrow();
        expect(() => calculator.calculate('H2O#SO4')).toThrow();
        expect(() => calculator.calculate('Fe$2O3')).toThrow();
        expect(() => calculator.calculate('Ca_OH')).toThrow();
    });

    test('should throw for invalid characters at end of formula', () => {
        expect(() => calculator.calculate('H2O.')).toThrow();
        expect(() => calculator.calculate('NaCl_')).toThrow();
        expect(() => calculator.calculate('Fe2O3#')).toThrow();
        expect(() => calculator.calculate('CaOH@')).toThrow();
    });

    test('should throw for invalid formula boundaries', () => {
        expect(() => calculator.calculate('.')).toThrow();
        expect(() => calculator.calculate('(')).toThrow();
        expect(() => calculator.calculate(')')).toThrow();
        expect(() => calculator.calculate('1')).toThrow();
    });

    test('should throw for unmatched parentheses', () => {
        expect(() => calculator.calculate('((H2O))')).not.toThrow();
        expect(() => calculator.calculate('((H2O)))')).toThrow();
        expect(() => calculator.calculate('((H2O)')).toThrow();
        expect(() => calculator.calculate('(H2O))')).toThrow();
        expect(() => calculator.calculate('(H2O')).toThrow();
    });
});