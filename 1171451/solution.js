const records = [
    'id,first_name,last_name,country',
    '1,John,Smith,USA',
    '2,Jane,Doe,USA',
    '3,Emily,Jones,USA',
    '4,David,Johnson,USA',
    '5,James,Brown,USA'
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
    }
]

function parseCSV(data, mapping) {

    const records = data.split('\n');
    const columns = records.shift().split(',');

    return records.map(record => {
        const values = record.split(',');
        return columns.reduce((acc, column, index) => {
            const map = mapping.find(m => m.name === column);
            acc[column] = map.render ? map.render(values[index]) : values[index];
            return acc;
        }, {});
    });
}

console.log(parseCSV(records.join('\n'), columnMapping));