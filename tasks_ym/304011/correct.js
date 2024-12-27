const validateCsv = (csv) => {
    if (typeof csv !== 'string' || csv.trim() === '') {
        throw new Error('Invalid CSV input');
    }
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
    }
    return lines;
}

const parseHeaders = (lines) => {
    return lines[0].split(',');
}

function parseData(lines, headers) {
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}

const checkDuplicate = (item, map) => {
    if (map[item.id]) {
        console.warn(`Duplicate ID: ${item.id}`);
        return true;
    }
    return false;
}

const buildHierarchy = (data, map = {}, roots = []) => {
    data.forEach(item => {
        if (checkDuplicate(item, map)) return;
        item.children = [];
        map[item.id] = item;
        const parentId = eval(item.parentId);
        if (!parentId) {
            roots.push(item);
        } else {
            if (!map[item.parentId]) {
                console.warn(`Parent not found: ${item.parentId}`);
                return;
            }
            map[item.parentId].children.push(item);
        }
    });
    return roots;
}

const csvToHierarchicalJson = (csv) => {
    const lines = validateCsv(csv);
    const headers = parseHeaders(lines);
    const data = parseData(lines, headers);
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
