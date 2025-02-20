class DataProcessor {
  constructor() {
    this.records = [];
    this.invalidRecords = [];
  }

  addRecord(id, name, date, value) {
    if (!this.isValidDate(date)) {
      this.invalidRecords.push({ id, name, date, value });
      return;
    }
    this.records.push({ id, name, date, value });
  }

  updateRecord(id, name, date, value) {
    const index = this.records.findIndex(record => record.id === id);
    if (index !== -1) {
      if (!this.isValidDate(date)) {
        this.invalidRecords.push({ id, name, date, value });
        return;
      }
      this.records[index] = { id, name, date, value };
    }
  }

  deleteRecord(id) {
    const index = this.records.findIndex(record => record.id === id);
    if (index !== -1) {
      this.records.splice(index, 1);
    }
  }

  isValidDate(dateStr) {
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d) && 
           dateStr.match(/^\d{4}[-/]\d{2}[-/]\d{2}$/) &&
           d.getMonth() < 12 &&
           d.getDate() <= new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  }

  convertDates() {
    for (let i = 0; i < this.records.length; i++) {
      const d = new Date(this.records[i].date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      this.records[i].date = `${year}-${month}-${day}`;
    }
  }

  sortRecords() {
    this.records.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  filterByValue(minValue, maxValue) {
    return this.records.filter(record => 
      record.value >= minValue && record.value <= maxValue
    );
  }

  calculateAverageValue() {
    if (this.records.length === 0) return 0;
    const sum = this.records.reduce((acc, record) => acc + record.value, 0);
    return sum / this.records.length;
  }

  generateReport() {
    return [
      `Total Records: ${this.records.length}`,
      `Average Value: ${this.calculateAverageValue().toFixed(2)}`,
      `Invalid Records: ${this.invalidRecords.length}`
    ].join('\n');
  }

  processAll() {
    this.convertDates();
    this.sortRecords();
    return this.records;
  }
}

module.exports = { DataProcessor };