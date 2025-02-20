const {calculateMolarMass} = require('./solution');

describe('Molar Mass Calculator', () => {
    // Success cases
    test('should calculate simple molecules correctly', () => {
        expect(calculateMolarMass('H2')).toBe(2);
        expect(calculateMolarMass('O2')).toBe(32);
        expect(calculateMolarMass('N2')).toBe(28);
        expect(calculateMolarMass('Cl2')).toBe(70);
    });

    test('should calculate compounds with single elements correctly', () => {
        expect(calculateMolarMass('H2O')).toBe(18);
        expect(calculateMolarMass('CO2')).toBe(44);
        expect(calculateMolarMass('NH3')).toBe(17);
        expect(calculateMolarMass('CH4')).toBe(16);
    });

    test('should handle compounds with multiple elements correctly', () => {
        expect(calculateMolarMass('NaOH')).toBe(40);
        expect(calculateMolarMass('H2SO4')).toBe(98);
        expect(calculateMolarMass('Ca(OH)2')).toBe(74);
        expect(calculateMolarMass('NaCl')).toBe(58);
    });

    test('should handle complex molecules with nested parentheses', () => {
        expect(calculateMolarMass('(NH4)2SO4')).toBe(132);
        expect(calculateMolarMass('Cu(NO3)2')).toBe(188);
        expect(calculateMolarMass('Fe(ClO4)3')).toBe(353);
        expect(calculateMolarMass('(NH4)3PO4')).toBe(149);
    });

    test('should handle multiple nested parentheses', () => {
        expect(calculateMolarMass('((CH3)3Si)2NH')).toBe(161);
        expect(calculateMolarMass('(Cu(NH3)4)SO4')).toBe(228);
        expect(calculateMolarMass('((H2N)2CO)2')).toBe(120);
    });

    test('should handle single elements and groups', () => {
        expect(calculateMolarMass('H')).toBe(1);
        expect(calculateMolarMass('Na')).toBe(23);
        expect(calculateMolarMass('(OH)')).toBe(17);
        expect(calculateMolarMass('(H2O)')).toBe(18);
    });

    test('should handle elements with lowercase letters', () => {
        expect(calculateMolarMass('He')).toBe(4);
        expect(calculateMolarMass('Fe')).toBe(56);
        expect(calculateMolarMass('Au')).toBe(197);
        expect(calculateMolarMass('(He)2')).toBe(8);
    });

    test('should handle compounds with large numbers', () => {
        expect(calculateMolarMass('Fe2O3')).toBe(160);
        expect(calculateMolarMass('Al2(SO4)3')).toBe(342);
        expect(calculateMolarMass('K4Fe(CN)6')).toBe(368);
        expect(calculateMolarMass('Fe100')).toBe(5600);
        expect(calculateMolarMass('(OH)100')).toBe(1700);
    });

    // Error cases - all should just throw an error
    test('should throw for invalid input types', () => {
        expect(() => calculateMolarMass(null)).toThrow();
        expect(() => calculateMolarMass(undefined)).toThrow();
        expect(() => calculateMolarMass(123)).toThrow();
        expect(() => calculateMolarMass('')).toThrow();
        expect(() => calculateMolarMass({})).toThrow();
        expect(() => calculateMolarMass([])).toThrow();
    });

    test('should throw for invalid characters', () => {
        expect(() => calculateMolarMass('H2O#')).toThrow();
        expect(() => calculateMolarMass('H@2O')).toThrow();
        expect(() => calculateMolarMass('H2O$')).toThrow();
        expect(() => calculateMolarMass('H2O_')).toThrow();
        expect(() => calculateMolarMass('H2O.')).toThrow();
        expect(() => calculateMolarMass('H2O/')).toThrow();
    });

    test('should throw for invalid element symbols', () => {
        expect(() => calculateMolarMass('Xx')).toThrow();
        expect(() => calculateMolarMass('Xyz')).toThrow();
        expect(() => calculateMolarMass('Aa')).toThrow();
        expect(() => calculateMolarMass('Zz')).toThrow();
    });

    test('should throw for malformed parentheses', () => {
        expect(() => calculateMolarMass('((H2O)')).toThrow();
        expect(() => calculateMolarMass('(H2O))')).toThrow();
        expect(() => calculateMolarMass('((())')).toThrow();
        expect(() => calculateMolarMass('())')).toThrow();
        expect(() => calculateMolarMass('(()')).toThrow();
        expect(() => calculateMolarMass(')H2O(')).toThrow();
    });

    test('should throw for empty or invalid groups', () => {
        expect(() => calculateMolarMass('()')).toThrow();
        expect(() => calculateMolarMass('()2')).toThrow();
        expect(() => calculateMolarMass('(2)')).toThrow();
        expect(() => calculateMolarMass('(#)')).toThrow();
        expect(() => calculateMolarMass('(())')).toThrow();
        expect(() => calculateMolarMass('((()))')).toThrow();
    });

    test('should throw for invalid formula starts', () => {
        expect(() => calculateMolarMass('1H2O')).toThrow();
        expect(() => calculateMolarMass('2NaCl')).toThrow();
        expect(() => calculateMolarMass('#H2O')).toThrow();
        expect(() => calculateMolarMass('.H2O')).toThrow();
        expect(() => calculateMolarMass('_H2O')).toThrow();
        expect(() => calculateMolarMass(' H2O')).toThrow();
    });

    test('should throw for invalid characters in groups', () => {
        expect(() => calculateMolarMass('(H2O#)')).toThrow();
        expect(() => calculateMolarMass('(Na@Cl)')).toThrow();
        expect(() => calculateMolarMass('(H2O.)')).toThrow();
        expect(() => calculateMolarMass('(H2O_)')).toThrow();
        expect(() => calculateMolarMass('(H2O$)')).toThrow();
    });

    test('should throw for invalid characters after valid elements', () => {
        expect(() => calculateMolarMass('Na@Cl')).toThrow();
        expect(() => calculateMolarMass('H2O#SO4')).toThrow();
        expect(() => calculateMolarMass('Fe$2O3')).toThrow();
        expect(() => calculateMolarMass('Ca_OH')).toThrow();
    });

    test('should throw for invalid characters at end of formula', () => {
        expect(() => calculateMolarMass('H2O.')).toThrow();
        expect(() => calculateMolarMass('NaCl_')).toThrow();
        expect(() => calculateMolarMass('Fe2O3#')).toThrow();
        expect(() => calculateMolarMass('CaOH@')).toThrow();
    });

    test('should throw for invalid formula boundaries', () => {
        expect(() => calculateMolarMass('.')).toThrow();
        expect(() => calculateMolarMass('(')).toThrow();
        expect(() => calculateMolarMass(')')).toThrow();
        expect(() => calculateMolarMass('1')).toThrow();
    });

    test('should throw for unmatched parentheses', () => {
        expect(() => calculateMolarMass('((H2O))')).not.toThrow();
        expect(() => calculateMolarMass('((H2O)))')).toThrow();
        expect(() => calculateMolarMass('((H2O)')).toThrow();
        expect(() => calculateMolarMass('(H2O))')).toThrow();
        expect(() => calculateMolarMass('(H2O')).toThrow();
    });
});