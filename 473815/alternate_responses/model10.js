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
      }
    }
  }
  convertDates() {
    for (let i = 0; i < this.records.length; i++) {
      let d = new Date(this.records[i].date);
      if (isNaN(d.getTime())) {
        this.invalidRecords.push(this.records[i]);
        continue;
      }
      let day = d.getDate();
      let month = d.getMonth() + 1;
      let year = d.getFullYear();
      this.records[i].date = year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
    }
  }
  sortRecords() {
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
    return sum / this.records.length;
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
dp.addRecord(2, "Alice", "2025-02-28", 300);
dp.addRecord(1, "Bob", "2025/02/28", 200);
dp.addRecord(3, "Charlie", "2025-02-27", 400);
dp.addRecord(4, "Daisy", "2025-13-01", 150);
dp.updateRecord(1, "Bob Updated", "2025-02-28", 250);
console.log(dp.processAll());
console.log(dp.filterByValue(200, 400));
console.log(dp.generateReport());