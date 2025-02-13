const { getMonthlyCalendar } = require('./incorrect');

describe('getMonthlyCalendar', () => {

    test('should throw an error for invalid input', () => {
        // year
        expect(() => getMonthlyCalendar(0, 1)).toThrow(Error);
        expect(() => getMonthlyCalendar(-1, 1)).toThrow(Error);
        expect(() => getMonthlyCalendar('invalid', 1)).toThrow(Error);
        expect(() => getMonthlyCalendar(null, 1)).toThrow(Error);
        expect(() => getMonthlyCalendar(undefined, 1)).toThrow(Error);
        expect(() => getMonthlyCalendar('', 1)).toThrow(Error);
        
        // month
        expect(() => getMonthlyCalendar(2023, 0)).toThrow(Error);
        expect(() => getMonthlyCalendar(2023, 13)).toThrow(Error);
        expect(() => getMonthlyCalendar(2023, -1)).toThrow(Error);
        expect(() => getMonthlyCalendar(2023, 'invalid')).toThrow(Error);
        expect(() => getMonthlyCalendar(2023, null)).toThrow(Error);
        expect(() => getMonthlyCalendar(2023, undefined)).toThrow(Error);
    });

    test('should generate a calendar for October 2023 starting on Sunday', () => {
        const calendar = getMonthlyCalendar(2023, 10);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 1, day: 'Sun', month: 10, year: 2023 });
        expect(calendar[1]).toEqual({ date: 2, day: 'Mon', month: 10, year: 2023 });
        expect(calendar[6]).toEqual({ date: 7, day: 'Sat', month: 10, year: 2023 });
        expect(calendar[15]).toEqual({ date: 16, day: 'Mon', month: 10, year: 2023 });
        expect(calendar[30]).toEqual({ date: 31, day: 'Tue', month: 10, year: 2023 });
    });

    test('should generate a calendar for February 2024 (leap year)', () => {
        const calendar = getMonthlyCalendar(2024, 2);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 28, day: 'Sun', month: 1, year: 2024 });
        expect(calendar[1]).toEqual({ date: 29, day: 'Mon', month: 1, year: 2024 });
        expect(calendar[2]).toEqual({ date: 30, day: 'Tue', month: 1, year: 2024 });
        expect(calendar[3]).toEqual({ date: 31, day: 'Wed', month: 1, year: 2024 });
        expect(calendar[4]).toEqual({ date: 1, day: 'Thu', month: 2, year: 2024 });
        expect(calendar[5]).toEqual({ date: 2, day: 'Fri', month: 2, year: 2024 });
        expect(calendar[41]).toEqual({ date: 9, day: 'Sat', month: 3, year: 2024 });
    });

    test('should generate a calendar for February 2023 (non-leap year)', () => {
        const calendar = getMonthlyCalendar(2023, 2);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 29, day: 'Sun', month: 1, year: 2023 });
        expect(calendar[1]).toEqual({ date: 30, day: 'Mon', month: 1, year: 2023 });
        expect(calendar[2]).toEqual({ date: 31, day: 'Tue', month: 1, year: 2023 });
        expect(calendar[3]).toEqual({ date: 1, day: 'Wed', month: 2, year: 2023 });
        expect(calendar[4]).toEqual({ date: 2, day: 'Thu', month: 2, year: 2023 });
        expect(calendar[5]).toEqual({ date: 3, day: 'Fri', month: 2, year: 2023 });
        expect(calendar[41]).toEqual({ date: 11, day: 'Sat', month: 3, year: 2023 });
    });

    test('should generate a calendar for April 2023 (30 days)', () => {
        const calendar = getMonthlyCalendar(2023, 4);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 26, day: 'Sun', month: 3, year: 2023 });
        expect(calendar[1]).toEqual({ date: 27, day: 'Mon', month: 3, year: 2023 });
        expect(calendar[2]).toEqual({ date: 28, day: 'Tue', month: 3, year: 2023 });
        expect(calendar[3]).toEqual({ date: 29, day: 'Wed', month: 3, year: 2023 });
        expect(calendar[4]).toEqual({ date: 30, day: 'Thu', month: 3, year: 2023 });
        expect(calendar[5]).toEqual({ date: 31, day: 'Fri', month: 3, year: 2023 });
        expect(calendar[6]).toEqual({ date: 1, day: 'Sat', month: 4, year: 2023 });
        expect(calendar[41]).toEqual({ date: 6, day: 'Sat', month: 5, year: 2023 });
    });

    test('should generate a calendar for December 2023 (transition to next year)', () => {
        const calendar = getMonthlyCalendar(2023, 12);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 26, day: 'Sun', month: 11, year: 2023 });
        expect(calendar[6]).toEqual({ date: 2, day: 'Sat', month: 12, year: 2023 });
        expect(calendar[7]).toEqual({ date: 3, day: 'Sun', month: 12, year: 2023 });
        expect(calendar[41]).toEqual({ date: 6, day: 'Sat', month: 1, year: 2024 });
    });

    test('should generate a calendar for January 2024 (transition from previous year)', () => {
        const calendar = getMonthlyCalendar(2024, 1);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 31, day: 'Sun', month: 12, year: 2023 });
        expect(calendar[6]).toEqual({ date: 6, day: 'Sat', month: 1, year: 2024 });
        expect(calendar[7]).toEqual({ date: 7, day: 'Sun', month: 1, year: 2024 });
        expect(calendar[41]).toEqual({ date: 10, day: 'Sat', month: 2, year: 2024 });
    });

    test('should generate a calendar for June 2025 (Month starting on Sunday)', () => {
        const calendar = getMonthlyCalendar(2025, 6);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 1, day: 'Sun', month: 6, year: 2025 });
        expect(calendar[6]).toEqual({ date: 7, day: 'Sat', month: 6, year: 2025 });
        expect(calendar[41]).toEqual({ date: 12, day: 'Sat', month: 7, year: 2025 });
    });

    test('should generate a calendar for March 2023 (Month starting on Wednesday)', () => {
        const calendar = getMonthlyCalendar(2023, 3);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 26, day: 'Sun', month: 2, year: 2023 });
        expect(calendar[1]).toEqual({ date: 27, day: 'Mon', month: 2, year: 2023 });
        expect(calendar[2]).toEqual({ date: 28, day: 'Tue', month: 2, year: 2023 });
        expect(calendar[3]).toEqual({ date: 1, day: 'Wed', month: 3, year: 2023 });
        expect(calendar[4]).toEqual({ date: 2, day: 'Thu', month: 3, year: 2023 });
        expect(calendar[5]).toEqual({ date: 3, day: 'Fri', month: 3, year: 2023 });
        expect(calendar[6]).toEqual({ date: 4, day: 'Sat', month: 3, year: 2023 });
        expect(calendar[41]).toEqual({ date: 8, day: 'Sat', month: 4, year: 2023 });
    });

    test('should generate a calendar for May 2021 (Month starting on Saturday)', () => {
        const calendar = getMonthlyCalendar(2021, 5);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 25, day: 'Sun', month: 4, year: 2021 });
        expect(calendar[1]).toEqual({ date: 26, day: 'Mon', month: 4, year: 2021 });
        expect(calendar[2]).toEqual({ date: 27, day: 'Tue', month: 4, year: 2021 });
        expect(calendar[3]).toEqual({ date: 28, day: 'Wed', month: 4, year: 2021 });
        expect(calendar[4]).toEqual({ date: 29, day: 'Thu', month: 4, year: 2021 });
        expect(calendar[5]).toEqual({ date: 30, day: 'Fri', month: 4, year: 2021 });
        expect(calendar[6]).toEqual({ date: 1, day: 'Sat', month: 5, year: 2021 });
        expect(calendar[41]).toEqual({ date: 5, day: 'Sat', month: 6, year: 2021 });
    });

    test('should generate a calendar for year as string and month as number', () => {
        const calendar = getMonthlyCalendar('2023', 2);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 29, day: 'Sun', month: 1, year: 2023 });
        expect(calendar[1]).toEqual({ date: 30, day: 'Mon', month: 1, year: 2023 });
        expect(calendar[2]).toEqual({ date: 31, day: 'Tue', month: 1, year: 2023 });
        expect(calendar[3]).toEqual({ date: 1, day: 'Wed', month: 2, year: 2023 });
        expect(calendar[4]).toEqual({ date: 2, day: 'Thu', month: 2, year: 2023 });
        expect(calendar[5]).toEqual({ date: 3, day: 'Fri', month: 2, year: 2023 });
        expect(calendar[41]).toEqual({ date: 11, day: 'Sat', month: 3, year: 2023 });
    });

    test('should generate a calendar for year as number and month as string', () => {
        const calendar = getMonthlyCalendar(2023, '2');
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 29, day: 'Sun', month: 1, year: 2023 });
        expect(calendar[1]).toEqual({ date: 30, day: 'Mon', month: 1, year: 2023 });
        expect(calendar[2]).toEqual({ date: 31, day: 'Tue', month: 1, year: 2023 });
        expect(calendar[3]).toEqual({ date: 1, day: 'Wed', month: 2, year: 2023 });
        expect(calendar[4]).toEqual({ date: 2, day: 'Thu', month: 2, year: 2023 });
        expect(calendar[5]).toEqual({ date: 3, day: 'Fri', month: 2, year: 2023 });
        expect(calendar[41]).toEqual({ date: 11, day: 'Sat', month: 3, year: 2023 });
    });

    test('should generate a calendar for July 2023 (31 days)', () => {
        const calendar = getMonthlyCalendar(2023, 7);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 25, day: 'Sun', month: 6, year: 2023 });
        expect(calendar[1]).toEqual({ date: 26, day: 'Mon', month: 6, year: 2023 });
        expect(calendar[2]).toEqual({ date: 27, day: 'Tue', month: 6, year: 2023 });
        expect(calendar[3]).toEqual({ date: 28, day: 'Wed', month: 6, year: 2023 });
        expect(calendar[4]).toEqual({ date: 29, day: 'Thu', month: 6, year: 2023 });
        expect(calendar[5]).toEqual({ date: 30, day: 'Fri', month: 6, year: 2023 });
        expect(calendar[6]).toEqual({ date: 1, day: 'Sat', month: 7, year: 2023 });
        expect(calendar[41]).toEqual({ date: 5, day: 'Sat', month: 8, year: 2023 });
    });

    test('should generate a calendar for November 2023 (30 days)', () => {
        const calendar = getMonthlyCalendar(2023, 11);
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 29, day: 'Sun', month: 10, year: 2023 });
        expect(calendar[1]).toEqual({ date: 30, day: 'Mon', month: 10, year: 2023 });
        expect(calendar[2]).toEqual({ date: 31, day: 'Tue', month: 10, year: 2023 });
        expect(calendar[3]).toEqual({ date: 1, day: 'Wed', month: 11, year: 2023 });
        expect(calendar[4]).toEqual({ date: 2, day: 'Thu', month: 11, year: 2023 });
        expect(calendar[5]).toEqual({ date: 3, day: 'Fri', month: 11, year: 2023 });
        expect(calendar[6]).toEqual({ date: 4, day: 'Sat', month: 11, year: 2023 });
        expect(calendar[41]).toEqual({ date: 9, day: 'Sat', month: 12, year: 2023 });
    });

   
    // test year as string and month as string
    test('should generate a calendar for year as string and month as string', () => {
        const calendar = getMonthlyCalendar('2023', '2');
        expect(calendar.length).toBe(42);
        expect(calendar[0]).toEqual({ date: 29, day: 'Sun', month: 1, year: 2023 });
        expect(calendar[1]).toEqual({ date: 30, day: 'Mon', month: 1, year: 2023 });
        expect(calendar[2]).toEqual({ date: 31, day: 'Tue', month: 1, year: 2023 });
        expect(calendar[3]).toEqual({ date: 1, day: 'Wed', month: 2, year: 2023 });
        expect(calendar[4]).toEqual({ date: 2, day: 'Thu', month: 2, year: 2023 });
        expect(calendar[5]).toEqual({ date: 3, day: 'Fri', month: 2, year: 2023 });
        expect(calendar[41]).toEqual({ date: 11, day: 'Sat', month: 3, year: 2023 });
    });
    
});