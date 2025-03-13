//data-reader.service.js
import fs from 'fs';

class DataReaderService {
  constructor() { }

  async readData() {
    const data1 = await fs.promises.readFile('./data1.json', 'utf-8');
    const data2 = await fs.promises.readFile('./data2.json', 'utf-8');
    const data3 = await fs.promises.readFile('./data3.json', 'utf-8');


    const parsedData1 = JSON.parse(data1);
    const parsedData2 = JSON.parse(data2);
    const parsedData3 = JSON.parse(data3);


    const concatenatedData = [...parsedData1, ...parsedData2, ...parsedData3];


    return concatenatedData;
  }
}

//data-processor.service.js
import crypto from 'crypto';
import DataReaderService from './data-reader.service.js';
class DataProcessorService {
  constructor() {
    this.dataReader = new DataReaderService();
  }


  async processData() {
    let concatenatedData = await this.dataReader.readData();
    let results = [];


    concatenatedData.forEach(item) => {
      const name = item.name ? item.name.toUpperCase() : '';
      const age = item.age;

      if (age > 30) {
        results.push({ ...item, processed: true });
      } else {
        results.push(item);
      }
    });


    results.forEach((result) => {
      if (result.password) {
        result.passwordHash = crypto.createHash('md5').update(result.password).digest('hex');
      }
    });


    return [...results];
  }
}

export default DataProcessorService;