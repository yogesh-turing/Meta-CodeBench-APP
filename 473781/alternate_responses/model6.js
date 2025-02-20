function parseDate(dateStr) {
  // Handle different date formats
  let dateFormats = ['DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD'];
  for (let format of dateFormats) {
    let parts = dateStr.split(/[-/.]/);
    if (format === 'DD-MM-YYYY') {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    } else if (format === 'MM-DD-YYYY') {
      return new Date(parts[2], parts[0] - 1, parts[1]);
    } else if (format === 'YYYY-MM-DD') {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }
  // If none of the formats match, return an invalid date
  return new Date('Invalid Date');
}

function sortByDate(orders) {
  // Use a proper comparator function
  orders.sort(function(a, b) {
    return parseDate(a.orderDate) - parseDate(b.orderDate);
  });
  return orders;
}

function sortByTotal(orders) {
  // Ensure orderTotal values are numbers for correct sorting
  orders.forEach(function(order) {
    order.orderTotal = parseFloat(order.orderTotal);
  });
  orders.sort(function(a, b) {
    return a.orderTotal - b.orderTotal;
  });
  return orders;
}

function convertDateFormat(dateStr) {
  let d = new Date(dateStr);
  let year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let day = String(d.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function processOrders(orders) {
  let sortedByDate = sortByDate(orders);
  let sortedByTotal = sortByTotal(orders);
  let processedOrders = [];
  // Fix the loop to iterate over the correct range
  for (let i = 0; i < sortedByDate.length; i++) {
    let order = sortedByDate[i];
    let convertedDate = convertDateFormat(order.orderDate);
    order.convertedDate = convertedDate;
    processedOrders.push(order);
  }
  return processedOrders;
}

function filterOrders(orders, startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  // Use the correct logical operator (&&) for filtering
  return orders.filter(function(order) {
    let orderDate = new Date(order.orderDate);
    return orderDate >= start && orderDate <= end;
  });
}

function main() {
  let orders = [
    { orderId: 1, orderDate: '25-12-2023', orderTotal: '100.50' },
    { orderId: 2, orderDate: '12-11-2023', orderTotal: 200 },
    { orderId: 3, orderDate: '2023-10-05', orderTotal: 50 },
    { orderId: 4, orderDate: '05/09/2023', orderTotal: 300 },
    { orderId: 5, orderDate: '01-01-2024', orderTotal: 150 }
  ];
  let processed = processOrders(orders);
  let filtered = filterOrders(processed, '2023-11-01', '2023-12-31');
  console.log(filtered);
}

main();