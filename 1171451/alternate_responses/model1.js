const records = [
    'ID,first_name,last_name,country,DOB',
    '1,John,Smith,Usa,1990-01-01',
    '2,Jane,Doe,Usa,1991-02-02',
    '3,Emily,Jones,Usa,1992-03-03',
    '4,David,Johnson,Usa,1993-04-04',
    '5,James,Brown,usa,1994-05-05'
  ];
  
  const columnMapping = [
    {
      name: 'id',
      type: 'number',
      render: (value) => parseInt(value)
    },
    {
      name: 'first_name',
      type: 'string',
      render: (value) => value.trim()
    },
    {
      name: 'last_name',
      type: 'string',
      render: (value) => value.trim()
    },
    {
      name: 'country',
      type: 'string',
      render: (value) => value.trim().toUpperCase()
    },
    {
      name: 'dob',
      type: 'date',
      format: 'yyyy-mm-dd',
      render: (value) => {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(Date.UTC(yr, month - 1, day));
      }
    }
  ];
  
  function parseCSV(data, mapping) {
    const records = data.split('\n');
    const headers = records.shift().split(',').map(header => header.toLowerCase());
  
    return records.map(record => {
      const values = record.split(',');
      return headers.reduce((acc, header, index) => {
        const map = mapping.find(m => m.name.toLowerCase() === header.toLowerCase());
        if (map) {
          acc[map.name] = map.render ? map.render(values[index]) : values[index];
        } else {
          acc[header] = values[index];
        }
        return acc;
      }, {});
    });
  }
  
  console.log(parseCSV(records.join('\n'), columnMapping));
  
  module.exports = { parseCSV };