const Model = require(process.env.TARGET_FILE);

const DEC_15 = new Date(`${new Date().getFullYear()}-12-15`).toISOString().split('T')[0];
const JAN_01 = new Date(`${new Date().getFullYear()}-01-01`).toISOString().split('T')[0];
const MAY_15 = new Date(`${new Date().getFullYear()}-05-15`).toISOString().split('T')[0];
const DEC_31 = new Date(`${new Date().getFullYear()}-12-31`).toISOString().split('T')[0];

describe('getDayAndWeekOfYear', () => {

    // null inputs: date
    test('should return error for null date input', () => {
        const result = Model.getDayAndWeekOfYear(null, 'yyyy-MM-dd');
        expect(result.error.length > 0).toBe(true);
    });

    // null inputs: format
    test('should return error for null format input', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, null);
        expect(result.error.length > 0).toBe(true);
    });

    // null inputs: start date
    test('should return dayOfYear and weekOfYear for null start date input', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, 'yyyy-MM-dd', null);
        expect([349, 350].includes(result.dayOfYear)).toBe(true);
        expect([50, 51].includes(result.weekOfYear)).toBe(true);
    });

    // undefined inputs: date
    test('should return error for undefined date input', () => {
        const result = Model.getDayAndWeekOfYear(undefined, 'yyyy-MM-dd');
        expect(result.error.length > 0).toBe(true);
    });

    // undefined inputs: format
    test('should return error for undefined format input', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, undefined);
        expect(result.error.length > 0).toBe(true);
    });

    // undefined inputs: start date
    test('should return dayOfYear and weekOfYear for undefined start date input', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, 'yyyy-MM-dd', undefined);
        expect([349, 350].includes(result.dayOfYear)).toBe(true);
        expect([50, 51].includes(result.weekOfYear)).toBe(true);
    });

    // invalid date input
    test('should return error for invalid date input', () => {
        const result = Model.getDayAndWeekOfYear('invalid', 'yyyy-MM-dd');
        expect(result.error.length > 0).toBe(true);
    });

    // invalid format input
    test('should return error for invalid format input', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, 'invalid');
        expect(result.error.length > 0).toBe(true);
    });

    // invalid start date input
    test('should return error for invalid start date input', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, 'yyyy-MM-dd', 'invalid');
        expect(result.error.length > 0).toBe(true);
    });

    // valid inputs
    test('should return dayOfYear and weekOfYear for valid inputs', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, 'yyyy-MM-dd', JAN_01);
        expect([349, 350].includes(result.dayOfYear)).toBe(true);
        expect([50, 51].includes(result.weekOfYear)).toBe(true);
    });

    // valid inputs: different start date
    test('should return dayOfYear and weekOfYear for different start date', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, 'yyyy-MM-dd', MAY_15);
        expect([213, 214, 215].includes(result.dayOfYear)).toBe(true);
        expect([31, 32].includes(result.weekOfYear)).toBe(true);
    });

    // start date is after date
    test('should return error if start date is after date', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, 'yyyy-MM-dd', DEC_31);
        expect(result.error.length > 0).toBe(true);
    });

    // date format is different from format
    test('should return error if date format is different from format', () => {
        const result = Model.getDayAndWeekOfYear('2021-12-15', 'yyyy/MM/dd');
        expect(result.error.length > 0).toBe(true);
    });

    // start date format is different from format
    test('should return error if start date format is different from format', () => {
        const result = Model.getDayAndWeekOfYear(DEC_15, 'yyyy-MM-dd', '2021/01/01');
        expect(result.error.length > 0).toBe(true);
    });

    // input jan 01 and start date jan 01
    test('should return dayOfYear and weekOfYear for input jan 01 and start date jan 01', () => {
        const result = Model.getDayAndWeekOfYear(JAN_01, 'yyyy-MM-dd', JAN_01);
        expect(result.dayOfYear).toBe(1);
        expect(result.weekOfYear).toBe(1);
    });

    // input dec 31 and start date jan 01
    test('should return dayOfYear and weekOfYear for input dec 31 and start date jan 01', () => {
        const result = Model.getDayAndWeekOfYear(DEC_31, 'yyyy-MM-dd', JAN_01);
        expect(result.dayOfYear >= 365).toBe(true);
        expect(result.weekOfYear >= 52).toBe(true);
    });

});