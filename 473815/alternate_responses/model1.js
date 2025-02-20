class DataProcessor {
  constructor() {
    this.records = [];
    this.invalidRecords = [];
  }

  isValidDate(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && dateStr.length >= 8;
  }

  formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  addRecord(id, name, date, value) {
    if (!this.isValidDate(date)) {
      this.invalidRecords.push({ id, name, date, value });
      return;
    }
    this.records.push({
      id,
      name,
      date: this.formatDate(date),
      value: Number(value)
    });
  }

  updateRecord(id, name, date, value) {
    const index = this.records.findIndex(record => record.id === id);
    if (index !== -1) {
      if (!this.isValidDate(date)) {
        this.invalidRecords.push({ id, name, date, value });
        return;
      }
      this.records[index] = {
        id,
        name,
        date: this.formatDate(date),
        value: Number(value)
      };
    }
  }

  deleteRecord(id) {
    const index = this.records.findIndex(record => record.id === id);
    if (index !== -1) {
      this.records.splice(index, 1);
    }
  }

  convertDates() {
    for (let i = 0; i < this.records.length; i++) {
      try {
        const date = new Date(this.records[i].date);
        if (isNaN(date)) {
          this.invalidRecords.push(this.records[i]);
          this.records.splice(i, 1);
          i--;
          continue;
        }
        this.records[i].date = this.formatDate(date);
      } catch (error) {
        this.invalidRecords.push(this.records[i]);
        this.records.splice(i, 1);
        i--;
      }
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