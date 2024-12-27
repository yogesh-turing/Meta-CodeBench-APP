function csvToHierarchicalJson(csv) {

    if (typeof csv !== 'string' || csv.trim() === '') {
        throw new Error('Invalid CSV input');
    }

    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });

    const map = {};
    const roots = [];

    data.forEach(item => {
        if (map[item.id]) {
            // log error to console instead of throwing error and continue with the next item
            console.warn(`Duplicate ID: ${item.id}`);
            return;
        }
        item.children = [];
        map[item.id] = item;
        const parentId = eval(item.parentId);
        if (!parentId) {
            roots.push(item);
        } else {
            if (!map[item.parentId]) {
                // log error to console instead of throwing error and continue with the next item
                console.warn(`Parent not found: ${item.parentId}`);
                return;
            }
            map[item.parentId].children.push(item);
        }
    });

    return roots;
}

module.exports = {
    csvToHierarchicalJson
};