class DataProcessor {
  constructor() {
    this.records = [];
    this.invalidRecords = [];
  }

  addRecord(id, name, date, value) {
    this.records.push({ id, name, date, value });
  }

  updateRecord(id, name, date, value) {
    const recordIndex = this.records.findIndex(record => record.id === id);
    if (recordIndex !== -1) {
      this.records[recordIndex].name = name;
      this.records[recordIndex].date = date;
      this.records[recordIndex].value = value;
    }
  }

  deleteRecord(id) {
    this.records = this.records.filter(record => record.id !== id);
  }

  convertDates() {
    this.records.forEach(record => {
      const date = new Date(record.date);
      if (isNaN(date.getTime())) {
        this.invalidRecords.push(record);
      } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        record.date = `${year}-${month}-${day}`;
      }
    });
  }

  sortRecords() {
    this.records.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  filterByValue(minValue, maxValue) {
    return this.records.filter(record => record.value >= minValue && record.value <= maxValue);
  }

  calculateAverageValue() {
    const sum = this.records.reduce((acc, record) => acc + record.value, 0);
    return sum / this.records.length;
  }

  generateReport() {
    const report = `Total Records: ${this.records.length}\n`;
    report += `Average Value: ${this.calculateAverageValue()}\n`;
    report += `Invalid Records: ${this.invalidRecords.length}`;
    return report;
  }

  processAll() {
    this.convertDates();
    this.sortRecords();
    return this.records;
  }
}

const dp = new DataProcessor();
dp.addRecord(2, "Alice", "2025-02-28", 300);
dp.addRecord(1, "Bob", "2025-02-28", 200);
dp.addRecord(3, "Charlie", "2025-02-27", 400);
dp.addRecord(4, "Daisy", "2025-13-01", 150);
dp.updateRecord(1, "Bob Updated", "2025-02-28", 250);

console.log(dp.processAll());
console.log(dp.filterByValue(200, 400));
console.log(dp.generateReport());