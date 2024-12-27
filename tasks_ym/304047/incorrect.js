function csvToHierarchicalJson(csv) {
  // Handle invalid input
  if (!csv || typeof csv !== 'string') {
      return [];
  }

  // Split CSV into lines and handle empty input
  const lines = csv.trim().split('\n');
  if (lines.length < 2) {  // Need at least headers and one data row
      return [];
  }

  // Process headers
  const headers = lines[0].split(',').map(header => header.trim());
  if (!headers.includes('id') || !headers.includes('parentId')) {
      return [];
  }

  const map = new Map();
  const roots = [];

  // Process each data row
  for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(value => value.trim());
      if (values.length !== headers.length) continue;

      // Create object from headers and values
      const item = headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
      }, {});

      // Initialize children array
      item.children = [];

      // Validate ID
      if (!item.id) continue;

      // Store item in map
      map.set(item.id, item);

      // Check if it's a root node
      const parentId = item.parentId;
      if (!parentId || 
          parentId === '0' || 
          parentId === 'null' || 
          parentId === 'undefined' || 
          parentId === '') {
          roots.push(item);
      } else {
          // Try to find and link to parent
          const parent = map.get(parentId);
          if (parent) {
              parent.children.push(item);
          } else {
              // If parent not found yet, store as root temporarily
              roots.push(item);
          }
      }
  }

  // Final pass to resolve any remaining parent-child relationships
  for (let i = roots.length - 1; i >= 0; i--) {
      const item = roots[i];
      const parentId = item.parentId;
      
      if (parentId && 
          parentId !== '0' && 
          parentId !== 'null' && 
          parentId !== 'undefined' && 
          parentId !== '') {
          const parent = map.get(parentId);
          if (parent) {
              parent.children.push(item);
              roots.splice(i, 1);
          }
      }
  }

  return roots;
}

module.exports = {csvToHierarchicalJson};