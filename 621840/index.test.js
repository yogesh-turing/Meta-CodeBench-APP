const { DataFrameComparator } = require('./solution');

describe("DataFrameComparator Test Suite", () => {
    // Test cases for normalizeColumn
    describe("normalizeColumn", () => {
        it("normalizeColumn - Numeric", () => {
            const column = [1, 2, 5];
            const expected = [0.0, 0.25, 1.0];
            const actual = DataFrameComparator.normalizeColumn(column);
            actual.forEach((value, index) => {
                expect(value).toBeCloseTo(expected[index], 6);
            });
        });

        it("normalizeColumn - Boolean", () => {
            const column = [true, false, true];
            const expected = [1.0, 0.0, 1.0];
            const actual = DataFrameComparator.normalizeColumn(column);
            expect(actual).toEqual(expected);
        });

        it("normalizeColumn - Empty Column", () => {
            const column = [];
            expect(() => DataFrameComparator.normalizeColumn(column)).toThrow("Column is empty.");
        });

        it("normalizeColumn - Negative Values", () => {
            const column = [-1, -2, 0, 1, 2];
            const expected = [0.25, 0.0, 0.5, 0.75, 1.0];
            const actual = DataFrameComparator.normalizeColumn(column);
            actual.forEach((value, index) => {
                expect(value).toBeCloseTo(expected[index], 6);
            });
        });

        it("normalizeColumn - All Same Values Edge Case", () => {
            const column = [42, 42, 42];
            const expected = [0.0, 0.0, 0.0];
            const actual = DataFrameComparator.normalizeColumn(column);
            expect(actual).toEqual(expected);
        });

        it("normalizeColumn - Single Value Column", () => {
            const column = [99];
            const expected = [0.0];
            const actual = DataFrameComparator.normalizeColumn(column);
            expect(actual).toEqual(expected);
        });

        it("normalizeColumn - Floating Point Numbers", () => {
            const column = [1.1, 2.2, 3.3, 4.4];
            const expected = [0.0, 0.3333333333333333, 0.6666666666666666, 1.0];
            const actual = DataFrameComparator.normalizeColumn(column);
            actual.forEach((value, index) => {
                expect(value).toBeCloseTo(expected[index], 6);
            });
        });

        it("normalizeColumn - Alternating Booleans", () => {
            const column = [true, false, true, false];
            const expected = [1.0, 0.0, 1.0, 0.0];
            const actual = DataFrameComparator.normalizeColumn(column);
            expect(actual).toEqual(expected);
        });
    });

    // Test cases for compareDataFrames
    describe("compareDataFrames", () => {
        it("compareDataFrames - Missing Column", () => {
            const df1 = [[1, 2, 3]];
            const df2 = [[1, 2]];
            expect(() => DataFrameComparator.compareDataFrames(df1, df2)).toThrow();
        });

        it("compareDataFrames - Different Column Sizes", () => {
            const df1 = [[1, 2, 3]];
            const df2 = [[1, 2]];
            expect(() => DataFrameComparator.compareDataFrames(df1, df2)).toThrow();
        });

        it("compareDataFrames - Empty Columns", () => {
            const df1 = [[], []];
            const df2 = [[], []];
            const expected = [1.0, 1.0];
            const actual = DataFrameComparator.compareDataFrames(df1, df2);
            expect(actual).toEqual(expected);
        });

        it("compareDataFrames - Null Values", () => {
            const df1 = [[1, null, 3]];
            const df2 = [[1, 2, 3]];
            expect(() => DataFrameComparator.compareDataFrames(df1, df2)).toThrow();
        });

        it("compareDataFrames - Single Value Columns", () => {
            const df1 = [[1], ["a"], [true]];
            const df2 = [[1], ["a"], [true]];
            const expected = [1.0, 1.0, 1.0];
            const actual = DataFrameComparator.compareDataFrames(df1, df2);
            expect(actual).toEqual(expected);
        });

        it("compareDataFrames - All Same Values", () => {
            const df1 = [
                [1, 1, 1],
                ["a", "a", "a"],
            ];
            const df2 = [
                [1, 1, 1],
                ["a", "a", "a"],
            ];
            const expected = [1.0, 1.0];
            const actual = DataFrameComparator.compareDataFrames(df1, df2);
            expect(actual).toEqual(expected);
        });

        it("compareDataFrames - Special Characters", () => {
            const df1 = [["@#$", "%%%"]];
            const df2 = [["@#$", "%%%"]];
            const expected = [1.0];
            const actual = DataFrameComparator.compareDataFrames(df1, df2);
            expect(actual).toEqual(expected);
        });

        it("compareDataFrames - Empty Strings", () => {
            const df1 = [["", "test", ""]];
            const df2 = [["", "test", ""]];
            const expected = [1.0];
            const actual = DataFrameComparator.compareDataFrames(df1, df2);
            expect(actual).toEqual(expected);
        });

        it("compareDataFrames - Multiple Null Values", () => {
            const df1 = [[1, null, 3]];
            const df2 = [[1, null, 3]];
            expect(() => DataFrameComparator.compareDataFrames(df1, df2)).toThrow();
        });

        it("compareDataFrames - Undefined Values", () => {
            const df1 = [[1, undefined, 3]];
            const df2 = [[1, 2, 3]];
            expect(() => DataFrameComparator.compareDataFrames(df1, df2)).toThrow();
        });

        it("compareDataFrames - Zero Length Columns", () => {
            const df1 = [[]];
            const df2 = [[]];
            const expected = [1.0];
            const actual = DataFrameComparator.compareDataFrames(df1, df2);
            expect(actual).toEqual(expected);
        });

        it("compareDataFrames - Mixed Types Array", () => {
            const df1 = [[1, "a", true]];
            const df2 = [[1, "a", true]];
            expect(() => DataFrameComparator.compareDataFrames(df1, df2)).toThrow();
        });
    });
});
