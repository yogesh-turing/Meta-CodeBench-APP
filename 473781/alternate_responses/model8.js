function parseDate(dateStr) {
  let parts = dateStr.split(/[-/.]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) { // YYYY-MM-DD
      return new Date(parts[0], parts[1] - 1, parts[2]);
    } else { // DD-MM-YYYY or MM-DD-YYYY
      if (parts[0].length === 2 && parts[1].length === 2) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
      } else {
        return new Date(parts[2], parts[0] - 1, parts[1]);
      }
    }
  } else {
    throw new Error("Invalid date format: " + dateStr);
  }
}

function sortByDate(orders) {
  orders.sort(function(a, b) {
    return parseDate(a.orderDate).getTime() - parseDate(b.orderDate).getTime();
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
  let d = parseDate(dateStr);
  let year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let day = String(d.getDate()).padStart(2, '0');
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
    let orderDate = parseDate(order.orderDate);
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