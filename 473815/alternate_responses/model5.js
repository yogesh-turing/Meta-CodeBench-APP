class DataProcessor {
  constructor() {
    this.records = [];
    this.invalidRecords = [];
  }

  isValidDate(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && 
           dateStr.match(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/);
  }

  addRecord(id, name, date, value) {
    if (!this.isValidDate(date)) {
      this.invalidRecords.push({ id, name, date, value });
      return;
    }
    if (typeof value !== 'number' || isNaN(value)) {
      this.invalidRecords.push({ id, name, date, value });
      return;
    }
    this.records.push({ id, name, date, value });
  }

  updateRecord(id, name, date, value) {
    const index = this.records.findIndex(record => record.id === id);
    if (index !== -1) {
      if (!this.isValidDate(date)) {
        return false;
      }
      if (typeof value !== 'number' || isNaN(value)) {
        return false;
      }
      this.records[index] = { id, name, date, value };
      return true;
    }
    return false;
  }

  deleteRecord(id) {
    const index = this.records.findIndex(record => record.id === id);
    if (index !== -1) {
      this.records.splice(index, 1);
      return true;
    }
    return false;
  }

  convertDates() {
    for (let i = 0; i < this.records.length; i++) {
      const d = new Date(this.records[i].date);
      if (isNaN(d)) {
        this.invalidRecords.push(this.records[i]);
        this.records.splice(i, 1);
        i--;
        continue;
      }
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
    if (typeof minValue !== 'number' || typeof maxValue !== 'number') {
      return [];
    }
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
    const average = this.calculateAverageValue();
    return [
      `Total Records: ${this.records.length}`,
      `Average Value: ${average.toFixed(2)}`,
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