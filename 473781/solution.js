function parseDate(dateStr) {
  // Handle multiple date formats
  if (dateStr.includes('-')) {
    let parts = dateStr.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD format
      return new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      // DD-MM-YYYY format
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
  } else if (dateStr.includes('/')) {
    let parts = dateStr.split('/');
    return new Date(parts[2], parts[0] - 1, parts[1]); // MM/DD/YYYY
  }
  return new Date(dateStr); // Fallback
}

function sortByDate(orders) {
  return orders.sort((a, b) => parseDate(a.orderDate) - parseDate(b.orderDate));
}

function sortByTotal(orders) {
  return orders.sort((a, b) => parseFloat(a.orderTotal) - parseFloat(b.orderTotal));
}

function convertDateFormat(dateStr) {
  let d = parseDate(dateStr);
  let year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function processOrders(orders) {
  let sortedByDate = sortByDate([...orders]); // Ensure we don't mutate original array
  let processedOrders = sortedByDate.map(order => ({
    ...order,
    convertedDate: convertDateFormat(order.orderDate),
  }));
  return processedOrders;
}

function filterOrders(orders, startDate, endDate) {
  let start = new Date(startDate).getTime();
  let end = new Date(endDate).getTime();
  return orders.filter(order => {
    let orderTime = parseDate(order.orderDate).getTime();
    return orderTime >= start && orderTime <= end;
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

module.exports = { parseDate, sortByDate, sortByTotal, convertDateFormat, processOrders, filterOrders };