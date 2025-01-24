const assert = require('assert');
const { getMonthlyCalendar } = require('./incorrect');

describe('getMonthlyCalendar', () => {
    it('should generate a calendar for October 2023 starting on Sunday', () => {
        const calendar = getMonthlyCalendar(2023, 10);
        assert.strictEqual(calendar.length, 42);
        assert.deepStrictEqual(calendar[0], { date: 1, day: 'Sun', month: 10, year: 2023 });
        assert.deepStrictEqual(calendar[1], { date: 2, day: 'Mon', month: 10, year: 2023 });
        assert.deepStrictEqual(calendar[6], { date: 7, day: 'Sat', month: 10, year: 2023 });
        assert.deepStrictEqual(calendar[15], { date: 16, day: 'Mon', month: 10, year: 2023 });
        assert.deepStrictEqual(calendar[30], { date: 31, day: 'Tue', month: 10, year: 2023 });
    });

    it('should generate a calendar for February 2024 (leap year)', () => {
        const calendar = getMonthlyCalendar(2024, 2);
        assert.strictEqual(calendar.length, 42);
        assert.deepStrictEqual(calendar[0], { date: 28, day: 'Sun', month: 1, year: 2024 });
        assert.deepStrictEqual(calendar[1], { date: 29, day: 'Mon', month: 1, year: 2024 });
        assert.deepStrictEqual(calendar[2], { date: 30, day: 'Tue', month: 1, year: 2024 });
        assert.deepStrictEqual(calendar[3], { date: 31, day: 'Wed', month: 1, year: 2024 });
        assert.deepStrictEqual(calendar[4], { date: 1, day: 'Thu', month: 2, year: 2024 });
        assert.deepStrictEqual(calendar[5], { date: 2, day: 'Fri', month: 2, year: 2024 });
        assert.deepStrictEqual(calendar[41], { date: 9, day: 'Sat', month: 3, year: 2024 });
    });

     it('should generate a calendar for February 2023 (non-leap year)', () => {
        const calendar = getMonthlyCalendar(2023, 2);
        assert.strictEqual(calendar.length, 42);
        assert.deepStrictEqual(calendar[0], { date: 29, day: 'Sun', month: 1, year: 2023 });
        assert.deepStrictEqual(calendar[1], { date: 30, day: 'Mon', month: 1, year: 2023 });
        assert.deepStrictEqual(calendar[2], { date: 31, day: 'Tue', month: 1, year: 2023 });
        assert.deepStrictEqual(calendar[3], { date: 1, day: 'Wed', month: 2, year: 2023 });
        assert.deepStrictEqual(calendar[4], { date: 2, day: 'Thu', month: 2, year: 2023 });
        assert.deepStrictEqual(calendar[5], { date: 3, day: 'Fri', month: 2, year: 2023 });
        assert.deepStrictEqual(calendar[41], { date: 11, day: 'Sat', month: 3, year: 2023 });
    });

    it('should generate a calendar for April 2023 (30 days)', () => {
        const calendar = getMonthlyCalendar(2023, 4);
        assert.strictEqual(calendar.length, 42);
        assert.deepStrictEqual(calendar[0], { date: 26, day: 'Sun', month: 3, year: 2023 });
        assert.deepStrictEqual(calendar[1], { date: 27, day: 'Mon', month: 3, year: 2023 });
        assert.deepStrictEqual(calendar[2], { date: 28, day: 'Tue', month: 3, year: 2023 });
        assert.deepStrictEqual(calendar[3], { date: 29, day: 'Wed', month: 3, year: 2023 });
        assert.deepStrictEqual(calendar[4], { date: 30, day: 'Thu', month: 3, year: 2023 });
        assert.deepStrictEqual(calendar[5], { date: 31, day: 'Fri', month: 3, year: 2023 });
        assert.deepStrictEqual(calendar[6], { date: 1, day: 'Sat', month: 4, year: 2023 });
        assert.deepStrictEqual(calendar[41], { date: 6, day: 'Sat', month: 5, year: 2023 });
    });

    it('should generate a calendar for December 2023 (transition to next year)', () => {
        const calendar = getMonthlyCalendar(2023, 12);
        assert.strictEqual(calendar.length, 42);
        assert.deepStrictEqual(calendar[0], { date: 26, day: 'Sun', month: 11, year: 2023 });
        assert.deepStrictEqual(calendar[6], { date: 2, day: 'Sat', month: 12, year: 2023 });
        assert.deepStrictEqual(calendar[7], { date: 3, day: 'Sun', month: 12, year: 2023 });
        assert.deepStrictEqual(calendar[41], { date: 6, day: 'Sat', month: 1, year: 2024 });

    });

    it('should generate a calendar for January 2024 (transition from previous year)', () => {
        const calendar = getMonthlyCalendar(2024, 1);
        assert.strictEqual(calendar.length, 42);
        assert.deepStrictEqual(calendar[0], { date: 31, day: 'Sun', month: 12, year: 2023 });
        assert.deepStrictEqual(calendar[6], { date: 6, day: 'Sat', month: 1, year: 2024 });
        assert.deepStrictEqual(calendar[7], { date: 7, day: 'Sun', month: 1, year: 2024 });
        assert.deepStrictEqual(calendar[41], { date: 10, day: 'Sat', month: 2, year: 2024 });
    });

    it('should throw an error for invalid input', () => {
        // year
        assert.throws(() => getMonthlyCalendar(0, 1), Error);
        assert.throws(() => getMonthlyCalendar(-1, 1), Error);
        assert.throws(() => getMonthlyCalendar('invalid', 1), Error);
        assert.throws(() => getMonthlyCalendar(null, 1), Error);
        assert.throws(() => getMonthlyCalendar(undefined, 1), Error);
        
        //month
        assert.throws(() => getMonthlyCalendar(2023, 0), Error);
        assert.throws(() => getMonthlyCalendar(2023, 13), Error);
        assert.throws(() => getMonthlyCalendar(2023, -1), Error);
        assert.throws(() => getMonthlyCalendar(2023, 'invalid'), Error);
        assert.throws(() => getMonthlyCalendar(2023, null), Error);
        assert.throws(() => getMonthlyCalendar(2023, undefined), Error);
    });

});
