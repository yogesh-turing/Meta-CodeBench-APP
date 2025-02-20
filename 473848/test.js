const { DataAggregator } = require("./solution");

describe("DataAggregator", () => {
    let aggregator;

    beforeEach(() => {
        aggregator = new DataAggregator();
    });

    test("Should insert and maintain sorted order by timestamp", () => {
        aggregator.addDataPoint({ id: 3, value: 50, timestamp: 1700000005 });
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });
        aggregator.addDataPoint({ id: 2, value: 20, timestamp: 1700000010 });

        expect(aggregator.data.map(d => d.id)).toEqual([1, 3, 2]); // Sorted by timestamp
    });

    test("Should prevent duplicate entries with the same id", () => {
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });

        expect(aggregator.data.length).toBe(1);
    });

    test("Should replace an old entry with a newer timestamp for the same id", () => {
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });
        aggregator.addDataPoint({ id: 1, value: 15, timestamp: 1700000020 });

        expect(aggregator.data.find(d => d.id === 1).value).toBe(15);
    });

    test("Should reject missing required fields", () => {
        expect(() => aggregator.addDataPoint({ id: 1, timestamp: 1700000000 })).toThrow("Field 'value' is required");
        expect(() => aggregator.addDataPoint({ value: 10, timestamp: 1700000000 })).toThrow("Field 'id' is required");
        expect(() => aggregator.addDataPoint({ id: 1, value: 10 })).toThrow("Field 'timestamp' is required");
    });

    test("Should filter results correctly", () => {
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });
        aggregator.addDataPoint({ id: 2, value: 20, timestamp: 1700000010 });

        expect(aggregator.getAggregatedData({ filter: { value: ">10" } })).toEqual([{ id: 2, value: 20, timestamp: 1700000010 }]);
    });

    test("Should compute aggregation correctly (sum, min, max, average) when passing an array", () => {
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });
        aggregator.addDataPoint({ id: 2, value: 20, timestamp: 1700000010 });
        aggregator.addDataPoint({ id: 3, value: 30, timestamp: 1700000020 });

        expect(aggregator.getAggregatedData({ filter: { value: ">5" }, aggregate: ["sum", "min", "max", "average"] })).toEqual({
            sum: 60,
            min: 10,
            max: 30,
            average: 20
        });
    });

    test("Should compute aggregation correctly with multiple filters and conditions", () => {
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });
        aggregator.addDataPoint({ id: 2, value: 20, timestamp: 1700000010 });
        aggregator.addDataPoint({ id: 3, value: 30, timestamp: 1700000020 });
        aggregator.addDataPoint({ id: 4, value: 40, timestamp: 1700000030 });
        aggregator.addDataPoint({ id: 5, value: 50, timestamp: 1700000040 });
    
        expect(
            aggregator.getAggregatedData({
                filter: { timestamp: ">1700000010, <1700000040" },
                aggregate: ["sum", "min", "max", "average"]
            })
        ).toEqual({
            sum: 70,   
            min: 30,    
            max: 40,   
            average: 35 
        });
    });
    

    test("Should ignore non-existent fields and use available ones", () => {
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });
        aggregator.addDataPoint({ id: 2, value: 20, timestamp: 1700000010 });

        expect(aggregator.getAggregatedData({ filter: { nonExistentField: ">10", value: ">5" }, aggregate: ["sum"] })).toEqual({ sum: 30 });
    });

    test("Should return an error when all query fields are non-existent", () => {
        aggregator.addDataPoint({ id: 1, value: 10, timestamp: 1700000000 });
        aggregator.addDataPoint({ id: 2, value: 20, timestamp: 1700000010 });

        expect(aggregator.getAggregatedData({ filter: { nonExistentField: ">10" }, aggregate: ["sum"] })).toEqual({ error: "Non-existent fields" });
    });
});