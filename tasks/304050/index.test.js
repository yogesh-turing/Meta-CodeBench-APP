const { getNextRecurrences } = require('./model_a');

describe('getNextRecurrences', () => {

    test('should throw an error for invalid start date', () => {
        expect(() => {
            getNextRecurrences('invalid-date', 5, 3);
        }).toThrow(Error);
    });

    test('should throw an error for invalid frequency', () => {
        expect(() => {
            getNextRecurrences('2023-10-15', -1, 3);
        }).toThrow(Error);
    });

    test('should throw an error for invalid count', () => {
        expect(() => {
            getNextRecurrences('2023-10-15', 5, 0);
        }).toThrow(Error);
    });

    // null inputs: startDate
    test('should throw an error for null start date', () => {
        expect(() => {
            getNextRecurrences(null, 5, 3);
        }).toThrow(Error);
    });

    // null inputs: frequency
    test('should throw an error for null frequency', () => {
        expect(() => {
            getNextRecurrences('2023-10-15', null, 3);
        }).toThrow(Error);
    });

    // null inputs: count
    test('should throw an error for null count', () => {
        expect(() => {
            getNextRecurrences('2023-10-15', 5, null);
        }).toThrow(Error);
    });

    // undefined inputs: startDate
    test('should throw an error for undefined start date', () => {
        expect(() => {
            getNextRecurrences(undefined, 5, 3);
        }).toThrow(Error);
    });

    // frequency less than 0
    test('should throw an error for frequency less than 0', () => {
        expect(() => {
            getNextRecurrences('2023-10-15', -1, 3);
        }).toThrow(Error);
    });

    test('should return correct recurrences without onlyWeekDays', () => {
        const startDate = '2023-10-15';
        const frequency = 5;
        const count = 3;
        const expected = [
            new Date('2023-10-15'),
            new Date('2023-10-20'),
            new Date('2023-10-25')
        ];
        const result = getNextRecurrences(startDate, frequency, count);
        expect(result).toEqual(expected);
    });

    test('should return correct recurrences with onlyWeekDays', () => {
        const startDate = '2023-10-13'; // Friday
        const frequency = 1;
        const count = 5;
        const expected = [
            new Date('2023-10-13'), // Friday
            new Date('2023-10-16'), // Monday
            new Date('2023-10-17'), // Tuesday
            new Date('2023-10-18'), // Wednesday
            new Date('2023-10-19')  // Thursday
        ];
        const result = getNextRecurrences(startDate, frequency, count, true);
        expect(result).toEqual(expected);
    });

    test('should handle crossing weekends correctly with onlyWeekDays', () => {
        const startDate = '2023-10-13'; // Friday
        const frequency = 3;
        const count = 3;
        const expected = [
            new Date('2023-10-13'), // Friday
            new Date('2023-10-18'), // Wednesday
            new Date('2023-10-23')  // Monday
        ];
        const result = getNextRecurrences(startDate, frequency, count, true);
        expect(result).toEqual(expected);
    });

    test('should return correct recurrences without onlyWeekDays', () => {
        const startDate = '2023-10-15';
        const frequency = 5;
        const count = 3;
        const expected = [
            new Date('2023-10-15'),
            new Date('2023-10-20'),
            new Date('2023-10-25')
        ];
        const result = getNextRecurrences(startDate, frequency, count);
        expect(result).toEqual(expected);
    });

    test('should return correct recurrences with onlyWeekDays', () => {
        const startDate = '2023-10-15'; // Sunday
        const frequency = 5;
        const count = 3;
        const onlyWeekDays = true;
        const expected = [
            new Date('2023-10-16'),
            new Date('2023-10-23'),
            new Date('2023-10-30')
        ];
        const result = getNextRecurrences(startDate, frequency, count, onlyWeekDays);
        expect(result).toEqual(expected);
    });

    test('should return correct recurrences with onlyWeekDays', () => {
        const startDate = '2023-10-15';
        const frequency = 10;
        const count = 5;
        const onlyWeekDays = false;
        const expected = [
            new Date('2023-10-15'),
            new Date('2023-10-25'),
            new Date('2023-11-04'),
            new Date('2023-11-14'),
            new Date('2023-11-24')
        ];
        const result = getNextRecurrences(startDate, frequency, count, onlyWeekDays);
        expect(result).toEqual(expected);
    });

    test('should return correct recurrences with onlyWeekDays', () => {
        const startDate = '2023-10-15';
        const frequency = 10;
        const count = 5;
        const onlyWeekDays = true;
        const expected = [
            new Date('2023-10-16'),
            new Date('2023-10-30'),
            new Date('2023-11-13'),
            new Date('2023-11-27'),
            new Date('2023-12-11')
        ];
        const result = getNextRecurrences(startDate, frequency, count, onlyWeekDays);
        expect(result).toEqual(expected);
    });
});