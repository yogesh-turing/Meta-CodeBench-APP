class DataProcessor {
  constructor() {
    this.records = [];
    this.invalidRecords = [];
  }
  addRecord(id, name, date, value) {
    this.records.push({ id: id, name: name, date: date, value: value });
  }
  updateRecord(id, name, date, value) {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === id) {
        this.records[i].name = name;
        this.records[i].date = date;
        this.records[i].value = value;
      }
    }
  }
  deleteRecord(id) {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === id) {
        this.records.splice(i, 1);
        i--; // adjust index after removal
      }
    }
  }
  convertDates() {
    for (let i = 0; i < this.records.length; i++) {
      const orig = this.records[i].date;
      // Use regex to enforce an accepted date format: YYYY-MM-DD or YYYY/MM/DD.
      const regex = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/;
      const match = orig.match(regex);
      if (match) {
        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const d = new Date(year, month - 1, day);
        // Check that the constructed date matches the provided parts.
        if (
          d.getFullYear() !== year ||
          (d.getMonth() + 1) !== month ||
          d.getDate() !== day
        ) {
          this.invalidRecords.push(this.records[i]);
          continue;
        }
        // Valid date: convert to "YYYY-MM-DD" with proper zero-padding.
        this.records[i].date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      } else {
        // For formats not matching our regex, try parsing using Date.
        const d = new Date(orig);
        if (isNaN(d.getTime())) {
          this.invalidRecords.push(this.records[i]);
          continue;
        }
        this.records[i].date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }
    }
  }
  sortRecords() {
    // Sort based on the date string (assuming valid dates are in "YYYY-MM-DD" format).
    this.records.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });
  }
  filterByValue(minValue, maxValue) {
    let filtered = [];
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].value >= minValue && this.records[i].value <= maxValue) {
        filtered.push(this.records[i]);
      }
    }
    return filtered;
  }
  calculateAverageValue() {
    let sum = 0;
    for (let i = 0; i < this.records.length; i++) {
      sum += this.records[i].value;
    }
    return this.records.length > 0 ? sum / this.records.length : 0;
  }
  generateReport() {
    let report = "";
    report += "Total Records: " + this.records.length + "\n";
    report += "Average Value: " + this.calculateAverageValue() + "\n";
    report += "Invalid Records: " + this.invalidRecords.length;
    return report;
  }
  processAll() {
    this.convertDates();
    this.sortRecords();
    return this.records;
  }
}

let dp = new DataProcessor();
dp.addRecord(2, "Alice", "2025-02-30", 300);      // Should be flagged as invalid.
dp.addRecord(1, "Bob", "2025/02/28", 200);        // Valid.
dp.addRecord(3, "Charlie", "2025-02-27", 400);     // Valid.
dp.addRecord(4, "Daisy", "2025-13-01", 150);       // Depending on JS Date behavior, this may parse as valid.
dp.updateRecord(1, "Bob Updated", "2025-02-29", 250); // If "2025-02-29" is not a valid date, it would be flagged.
console.log(dp.processAll());
console.log(dp.filterByValue(200, 400));
console.log(dp.generateReport());

module.exports = DataProcessor;