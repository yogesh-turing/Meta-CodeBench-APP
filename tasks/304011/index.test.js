const fs = require('fs').promises;
const path = require('path');
const { csvToJson } = require('./base');

describe('csvToJson', () => {
    const mockFilePath = 'data.csv';
    const mockFullPath = path.resolve(mockFilePath);

    const mockCSVData = `name,age,salary,joining_date,active\nJohn Doe,30,55000.5,2022-05-12,true\nJane Smith,25,60000.75,2023-01-15,false`;

    const config = {
        name: { type: 'string' },
        age: { type: 'integer' },
        salary: { type: 'decimal' },
        joining_date: { type: 'date', format: 'YYYY-MM-DD' },
        active: { type: 'boolean' }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should convert valid CSV to JSON', async () => {
        jest.spyOn(fs, 'access').mockResolvedValue();
        jest.spyOn(fs, 'readFile').mockResolvedValue(mockCSVData);

        const result = await csvToJson(mockFilePath, config);

        expect(result).toEqual([
            { name: 'John Doe', age: 30, salary: 55000.5, joining_date: new Date('2022-05-12'), active: true },
            { name: 'Jane Smith', age: 25, salary: 60000.75, joining_date: new Date('2023-01-15'), active: false }
        ]);
    });

    test('should throw an error if file does not exist', async () => {
        jest.spyOn(fs, 'access').mockRejectedValue(new Error('File does not exist'));

        await expect(csvToJson(mockFilePath, config)).rejects.toThrow('File does not exist');
    });

    test('should throw an error for an invalid file path', async () => {
        await expect(csvToJson(null, config)).rejects.toThrow('Invalid file path');
    });

    test('should throw an error for an invalid configuration', async () => {
        await expect(csvToJson(mockFilePath, null)).rejects.toThrow('Invalid configuration');
    });

    test('should handle malformed CSV rows by skipping them', async () => {
        jest.spyOn(fs, 'access').mockResolvedValue();
        jest.spyOn(fs, 'readFile').mockResolvedValue(`name,age\nJohn,25\nJane\nDoe,30`); // Jane's row is malformed

        const result = await csvToJson(mockFilePath, {
            name: { type: 'string' },
            age: { type: 'integer' }
        });

        expect(result).toEqual([
            { name: 'John', age: 25 },
            { name: 'Doe', age: 30 }
        ]);
    });

    test('should correctly parse currency values', async () => {
        jest.spyOn(fs, 'access').mockResolvedValue();
        jest.spyOn(fs, 'readFile').mockResolvedValue(`item,price\nLaptop,1200.99`);

        const result = await csvToJson(mockFilePath, {
            item: { type: 'string' },
            price: { type: 'currency', format: 'USD' }
        });

        expect(result).toEqual([{ item: 'Laptop', price: 'USD 1200.99' }]);
    });

    test('should correctly parse date, datetime, and time values', async () => {
        jest.spyOn(fs, 'access').mockResolvedValue();
        jest.spyOn(fs, 'readFile').mockResolvedValue(`date,datetime,time\n2023-01-01,2023-01-01 12:30:00,12:30:00`);

        const result = await csvToJson(mockFilePath, {
            date: { type: 'date', format: 'YYYY-MM-DD' },
            datetime: { type: 'datetime', format: 'YYYY-MM-DD HH:mm:ss' },
            time: { type: 'time', format: 'HH:mm:ss' }
        });

        expect(result).toEqual([
            {
                date: new Date('2023-01-01'),
                datetime: new Date('2023-01-01T12:30:00'),
                time: new Date('1970-01-01T12:30:00') // Default time parsing in JS
            }
        ]);
    });

    test('should handle empty CSV file', async () => {
        jest.spyOn(fs, 'access').mockResolvedValue();
        jest.spyOn(fs, 'readFile').mockResolvedValue('');

        const result = await csvToJson(mockFilePath, config);

        expect(result).toEqual([]);
    });

    test('should handle CSV with only headers', async () => {
        jest.spyOn(fs, 'access').mockResolvedValue();
        jest.spyOn(fs, 'readFile').mockResolvedValue('name,age,salary,joining_date,active');

        const result = await csvToJson(mockFilePath, config);

        expect(result).toEqual([]);
    });
});

