function parseDate(dateStr) {
  let formats = ['DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD'];
  let date = moment(dateStr, formats, true);
  return date.isValid() ? date.toDate() : null;
}

function sortByDate(orders) {
  orders.sort(function(a, b) {
    return parseDate(a.orderDate) - parseDate(b.orderDate);
  });
  return orders;
}

function sortByTotal(orders) {
  orders.sort(function(a, b) {
    return parseFloat(a.orderTotal) - parseFloat(b.orderTotal);
  });
  return orders;
}

function convertDateFormat(dateStr) {
  let d = new Date(dateStr);
  let day = d.getDate().toString().padStart(2, '0');
  let month = (d.getMonth() + 1).toString().padStart(2, '0');
  let year = d.getFullYear();
  return year + '-' + month + '-' + day;
}

function processOrders(orders) {
  let sortedByDate = sortByDate(orders);
  let sortedByTotal = sortByTotal(orders);
  let processedOrders = [];
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