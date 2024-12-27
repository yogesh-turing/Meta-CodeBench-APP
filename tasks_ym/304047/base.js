async function csvToHierarchicalJson(csv) {
  const lines = csv.trim().split('\n');
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
      item.children = [];
      map[item.id] = item;
      const parentId = item.parentId
      if (!parentId) {
          roots.push(item);
      } else {
          map[item.parentId].children.push(item);
      }
  });

  return roots;
}
module.exports = {csvToHierarchicalJson};