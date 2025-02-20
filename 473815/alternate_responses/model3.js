class DataProcessor {
  constructor() {
    this.records = [];
    this.invalidRecords = [];
  }

  validateDate(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && 
           date.toISOString().slice(0, 10) === dateStr;
  }

  addRecord(id, name, date, value) {
    if (!this.validateDate(date)) {
      this.invalidRecords.push({ id, name, date, value });
      return false;
    }
    this.records.push({ id, name, date, value });
    return true;
  }

  updateRecord(id, name, date, value) {
    const index = this.records.findIndex(record => record.id === id);
    if (index === -1) return false;
    
    if (!this.validateDate(date)) {
      this.invalidRecords.push({ id, name, date, value });
      return false;
    }

    this.records[index] = { id, name, date, value };
    return true;
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
    this.records = this.records.map(record => {
      const date = new Date(record.date);
      if (isNaN(date)) {
        this.invalidRecords.push(record);
        return null;
      }
      return {
        ...record,
        date: record.date // Keep ISO format for proper sorting
      };
    }).filter(record => record !== null);
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