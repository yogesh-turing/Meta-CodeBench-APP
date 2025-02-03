const { convertCsvToJson } = require('./model_a');

describe("convertCsvToJson", () => {

    test("Converts valid CSV to JSON correctly", () => {
        const csv = `id,name,amount,date,category
1,John Doe,120.5,12/10/2023,1
2,Jane Smith,90.00,11/25/2023,2
3,Tom Brown,45.75,10/05/2023,3
4,Alice Green,60.00,09/15/2023,4`;

        const expected = [
            {"id": "1", "name": "John Doe", "amount": 120.5, "date": "2023-12-10", "category": "Food"},
            {"id": "2", "name": "Jane Smith", "amount": 90.0, "date": "2023-11-25", "category": "Transport"},
            {"id": "3", "name": "Tom Brown", "amount": 45.75, "date": "2023-10-05", "category": "Entertainment"},
            {"id": "4", "name": "Alice Green", "amount": 60.0, "date": "2023-09-15", "category": "Other"}
        ];

        expect(convertCsvToJson(csv)).toEqual(expected);
    });

    test("Handles missing values gracefully", () => {
        const csv = `id,name,amount,date,category
1,John Doe,,12/10/2023,1
2,,90.00,11/25/2023,2
3,Tom Brown,45.75,,3
4,Alice Green,60.00,09/15/2023,`;

        const expected = [
            {"id": "1", "name": "John Doe", "amount": 0, "date": "2023-12-10", "category": "Food"},
            {"id": "2", "name": "", "amount": 90.0, "date": "2023-11-25", "category": "Transport"},
            {"id": "3", "name": "Tom Brown", "amount": 45.75, "date": "", "category": "Entertainment"},
            {"id": "4", "name": "Alice Green", "amount": 60.0, "date": "2023-09-15", "category": "Other"}
        ];

        expect(convertCsvToJson(csv)).toEqual(expected);
    });

    test("Handles empty CSV string", () => {
        expect(convertCsvToJson("")).toEqual([]);
    });

    test("Handles CSV with only headers and no data", () => {
        const csv = "id,name,amount,date,category";
        expect(convertCsvToJson(csv)).toEqual([]);
    });

    test("Handles extra spaces around values", () => {
        const csv = `id,name,amount,date,category
 1,   John Doe  , 120.5 , 12/10/2023 , 1 
 2 , Jane Smith ,90.00, 11/25/2023 ,2`;

        const expected = [
            {"id": "1", "name": "John Doe", "amount": 120.5, "date": "2023-12-10", "category": "Food"},
            {"id": "2", "name": "Jane Smith", "amount": 90.0, "date": "2023-11-25", "category": "Transport"}
        ];

        expect(convertCsvToJson(csv)).toEqual(expected);
    });

    test("Handles malformed CSV (missing columns in a row)", () => {
        const csv = `id,name,amount,date,category
1,John Doe,120.5,12/10/2023,1
2,Jane Smith,90.00,11/25/2023
3,Tom Brown,45.75,10/05/2023,3`;

        const expected = [
            {"id": "1", "name": "John Doe", "amount": 120.5, "date": "2023-12-10", "category": "Food"},
            {"id": "2", "name": "Jane Smith", "amount": 90.0, "date": "2023-11-25", "category": "Other"},
            {"id": "3", "name": "Tom Brown", "amount": 45.75, "date": "2023-10-05", "category": "Entertainment"}
        ];

        expect(convertCsvToJson(csv)).toEqual(expected);
    });

    test("Handles incorrect date format (should remain unchanged)", () => {
        const csv = `id,name,amount,date,category
1,John Doe,120.5,2023-12-10,1
2,Jane Smith,90.00,25/11/2023,2`;

        const expected = [
            {"id": "1", "name": "John Doe", "amount": 120.5, "date": "2023-12-10", "category": "Food"},
            {"id": "2", "name": "Jane Smith", "amount": 90.0, "date": "2023-25-11", "category": "Transport"}
        ];

        expect(convertCsvToJson(csv)).toEqual(expected);
    });

    test("Handles category values that are not in predefined mapping", () => {
        const csv = `id,name,amount,date,category
1,John Doe,120.5,12/10/2023,5
2,Jane Smith,90.00,11/25/2023,Unknown`;

        const expected = [
            {"id": "1", "name": "John Doe", "amount": 120.5, "date": "2023-12-10", "category": "Other"},
            {"id": "2", "name": "Jane Smith", "amount": 90.0, "date": "2023-11-25", "category": "Other"}
        ];

        expect(convertCsvToJson(csv)).toEqual(expected);
    });

});
