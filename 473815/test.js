const DataProcessor = require('./solution.js');

describe("DataProcessor Class Tests", () => {
  let dp;

  beforeEach(() => {
    dp = new DataProcessor();
  });

  test("updateRecord should correctly update only the matching record", () => {
    dp.addRecord(1, "Original", "2025-02-28", 100);
    dp.addRecord(2, "Another", "2025-03-01", 150);
    dp.updateRecord(1, "Updated", "2025-02-28", 120);
    
    // Check that record with id 1 is updated, and record with id 2 remains unchanged
    const record1 = dp.records.find(r => r.id === 1);
    const record2 = dp.records.find(r => r.id === 2);
    expect(record1.name).toBe("Updated");
    expect(record1.value).toBe(120);
    expect(record2.name).toBe("Another");
  });

  test("convertDates should convert valid dates to YYYY-MM-DD and handle invalid dates", () => {
    // Valid date
    dp.addRecord(1, "Valid Date", "2025-02-28", 100);
    // Invalid date formats (e.g., February 30th)
    dp.addRecord(2, "Invalid Date", "2025-02-30", 200);
    
    dp.convertDates();

    // Check valid record conversion
    const validRecord = dp.records.find(r => r.id === 1);
    expect(validRecord.date).toBe("2025-02-28");
    
    // Check that the invalid record was added to invalidRecords
    const invalidRecord = dp.invalidRecords.find(r => r.id === 2);
    expect(invalidRecord).toBeDefined();
  });

  test("sortRecords should sort records by date in ascending order", () => {
    dp.addRecord(1, "Record A", "2025-03-01", 100);
    dp.addRecord(2, "Record B", "2025-02-28", 150);
    dp.addRecord(3, "Record C", "2025-03-02", 200);
    
    // Convert dates to standard format before sorting
    dp.convertDates();
    dp.sortRecords();

    // After sorting, the record with the earliest date ("2025-02-28") should be first.
    expect(dp.records[0].name).toBe("Record B");
    expect(dp.records[1].name).toBe("Record A");
    expect(dp.records[2].name).toBe("Record C");
  });

  test("filterByValue should return only records with values within the specified range", () => {
    dp.addRecord(1, "Record A", "2025-02-28", 100);
    dp.addRecord(2, "Record B", "2025-03-01", 200);
    dp.addRecord(3, "Record C", "2025-03-02", 300);
    
    const filtered = dp.filterByValue(150, 250);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe(2);
  });

  test("calculateAverageValue should return the correct average", () => {
    dp.addRecord(1, "Record A", "2025-02-28", 100);
    dp.addRecord(2, "Record B", "2025-03-01", 200);
    
    const avg = dp.calculateAverageValue();
    expect(avg).toBe(150);
  });

  

  test("processAll should convert dates and return sorted records", () => {
    dp.addRecord(1, "Record A", "2025-03-01", 100);
    dp.addRecord(2, "Record B", "2025-02-28", 150);
    dp.addRecord(3, "Record C", "2025-03-02", 200);

    const processedRecords = dp.processAll();
    // Check that records are sorted by date after processing
    expect(processedRecords[0].name).toBe("Record B");
    expect(processedRecords[1].name).toBe("Record A");
    expect(processedRecords[2].name).toBe("Record C");

    // Also ensure that dates are in the standard format
    processedRecords.forEach(record => {
      // A basic regex to check for YYYY-MM-DD format
      expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});