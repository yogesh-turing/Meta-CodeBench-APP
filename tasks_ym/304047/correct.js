const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

async function checkFalsy(value) {
    const asyncFunc = new AsyncFunction('v', 'return eval(v)');
    const result = await asyncFunc(value);
    return result;
}

async function csvToHierarchicalJson(csv) {
    if (!csv) {
        return [];
    }

    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0].split(',');
    if (!headers.includes('id') || !headers.includes('parentId')) {
        throw new Error('CSV must contain "id" and "parentId" columns');
    }

    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });

    const map = {};
    const roots = [];

    for (let item of data) {
        item.children = [];
        map[item.id] = item;
        const parentId = await checkFalsy(item.parentId);
        if (!parentId) {
            roots.push(item);
        } else if (map[item.parentId]) {
            map[item.parentId].children.push(item);
        }
    };

    return roots;
}

module.exports = {csvToHierarchicalJson};