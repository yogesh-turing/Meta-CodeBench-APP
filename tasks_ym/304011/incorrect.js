function validateCsv(csv) {
    if (typeof csv !== 'string' || csv.trim() === '') {
        throw new Error('Invalid CSV input');
    }
    if (csv.trim().split('\n').length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
    }
}

function parseHeaders(csv) {
    const [headerLine] = csv.trim().split('\n');
    return headerLine.split(',');
}

function parseData(csv, headers) {
    return csv.trim().split('\n').slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}

function checkDuplicate(item, map) {
    if (map[item.id]) {
        console.warn(`Duplicate ID: ${item.id}`);
        return true;
    }
    return false;
}

function buildHierarchy(data) {
    const map = {};
    const roots = [];

    data.forEach(item => {
        if (checkDuplicate(item, map)) return;
        item.children = [];
        map[item.id] = item;
        const parentId = item.parentId;
        if (!parentId) {
            roots.push(item);
        } else {
            if (!map[parentId]) {
                console.warn(`Parent not found: ${parentId}`);
                return;
            }
            map[parentId].children.push(item);
        }
    });

    return roots;
}

function csvToHierarchicalJson(csv) {
    validateCsv(csv);
    const headers = parseHeaders(csv);
    const data = parseData(csv, headers);
    return buildHierarchy(data);
}

module.exports = {
    csvToHierarchicalJson,
    validateCsv,
    parseHeaders,
    parseData,
    checkDuplicate,
    buildHierarchy
}