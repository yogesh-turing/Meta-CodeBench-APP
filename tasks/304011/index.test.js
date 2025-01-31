const moment = require('moment');
const fs = require('fs').promises;
const path = require('path');
const { csvToJson } = require('./correct');

const formatDate = (date, format) => {
    return moment(date).format(format);
}

describe('csvToJson', () => {
    const mockCSVData = `name,age,salary,joining_date,active\nJohn Doe,30,55000.5,2022-05-12,true\nJane Smith,25,60000.75,2023-01-15,false`;
    const config = {
        name: { type: 'string' },
        age: { type: 'integer' },
        salary: { type: 'decimal' },
        joining_date: { type: 'date', format: 'YYYY-MM-DD' },
        active: { type: 'boolean' }
    };

    test('should convert valid CSV to JSON', async () => {
        const filePath = path.resolve(`data.csv`);
        await fs.writeFile(filePath, mockCSVData);
        const result = await csvToJson(filePath, config);
        expect(result).toEqual([
            { name: 'John Doe', age: 30, salary: 55000.5, joining_date: formatDate(new Date('2022-05-12'), config.joining_date.format), active: true },
            { name: 'Jane Smith', age: 25, salary: 60000.75, joining_date: formatDate(new Date('2023-01-15'), config.joining_date.format), active: false }
        ]);
        await fs.unlink(filePath)
    });

    test('should throw an error if file does not exist', async () => {
        const invalidFilePath = 'invalid.csv';
        await expect(csvToJson(invalidFilePath, config)).rejects.toThrow(Error);
    });

    test('should throw an error for an invalid file path', async () => {
        await expect(csvToJson(null, config)).rejects.toThrow(Error);
    });

    test('should throw an error for an invalid configuration', async () => {
        const filePath = path.resolve(`data.csv`);
        await fs.writeFile(filePath, mockCSVData);
        await expect(csvToJson(filePath, null)).rejects.toThrow(Error);
        await fs.unlink(filePath);
    });

    test('should handle malformed CSV rows by skipping them', async () => {
        const filePath = path.resolve(`malformed.csv`);
        const csvContent = `name,age\nJohn,25\nJane\nDoe,30`; // Jane's row is malformed
        await fs.writeFile(filePath, csvContent);
        const result = await csvToJson(filePath, {
            name: { type: 'string' },
            age: { type: 'integer' }
        });

        expect(result).toEqual([
            { name: 'John', age: 25 },
            { name: 'Doe', age: 30 }
        ]);
        await fs.unlink(filePath);
    });

    test('should correctly parse currency values', async () => {
         const filePath = path.resolve(`currency.csv`);
         await fs.writeFile(filePath, `item,price\nLaptop,1200.99`);
        const result = await csvToJson(filePath, {
            item: { type: 'string' },
            price: { type: 'currency', format: 'USD' }
        });
        expect(result).toEqual([{ item: 'Laptop', price: 'USD 1200.99' }]);
        await fs.unlink(filePath)
    });

    test('should correctly parse date, datetime, and time values', async () => {
        const mockCSVData = `date,datetime\n2023-01-01,2023-01-01 12:30:00`;
        const filePath = path.resolve(`datetime.csv`);
        await fs.writeFile(filePath, mockCSVData);
        const result = await csvToJson(filePath, {
            date: { type: 'date', format: 'YYYY-MM-DD' },
            datetime: { type: 'datetime', format: 'YYYY-MM-DD HH:mm:ss' },
        });
        expect(result).toEqual([
            {
                date: formatDate(new Date('2023-01-01'), 'YYYY-MM-DD'),
                datetime: formatDate(new Date('2023-01-01T12:30:00'), 'YYYY-MM-DD HH:mm:ss'),
            }
        ]);
        await fs.unlink(filePath);
    });

    test('should handle empty CSV file', async () => {
        const filePath = path.resolve(`empty.csv`);
        await fs.writeFile(filePath, '');
        await expect(csvToJson(filePath, config)).rejects.toThrow(Error);
        await fs.unlink(filePath);
    });

    test('should handle CSV with only headers', async () => {
        const filePath = path.resolve(`headers.csv`);
        await fs.writeFile(filePath, 'name,age,salary,joining_date,active');
        await expect(csvToJson(filePath, config)).rejects.toThrow(Error);
        await fs.unlink(filePath);
    });
});

