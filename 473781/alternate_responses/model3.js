function parseDate(dateStr) {
    // Handle different date formats (DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY)
    const formats = [
        /^(\d{2})-(\d{2})-(\d{4})$/,  // DD-MM-YYYY
        /^(\d{4})-(\d{2})-(\d{2})$/,  // YYYY-MM-DD
        /^(\d{2})\/(\d{2})\/(\d{4})$/ // DD/MM/YYYY
    ];

    for (let format of formats) {
        const match = dateStr.match(format);
        if (match) {
            if (format === formats[0]) {
                return new Date(`${match[3]}-${match[2]}-${match[1]}`);
            } else if (format === formats[1]) {
                return new Date(dateStr);
            } else {
                return new Date(`${match[3]}-${match[2]}-${match[1]}`);
            }
        }
    }
    throw new Error(`Invalid date format: ${dateStr}`);
}

function sortByDate(orders) {
    return [...orders].sort((a, b) => 
        parseDate(a.orderDate) - parseDate(b.orderDate)
    );
}

function sortByTotal(orders) {
    return [...orders].sort((a, b) => 
        Number(a.orderTotal) - Number(b.orderTotal)
    );
}

function convertDateFormat(dateStr) {
    const date = parseDate(dateStr);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

function processOrders(orders) {
    if (!Array.isArray(orders) || orders.length === 0) {
        return [];
    }

    const processedOrders = orders.map(order => ({
        ...order,
        orderTotal: Number(order.orderTotal),
        convertedDate: convertDateFormat(order.orderDate)
    }));

    return processedOrders;
}

function filterOrders(orders, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return orders.filter(order => {
        const orderDate = parseDate(order.orderDate);
        return orderDate >= start && orderDate <= end;
    });
}

function main() {
    const orders = [
        { orderId: 1, orderDate: '25-12-2023', orderTotal: '100.50' },
        { orderId: 2, orderDate: '12-11-2023', orderTotal: 200 },
        { orderId: 3, orderDate: '2023-10-05', orderTotal: 50 },
        { orderId: 4, orderDate: '05/09/2023', orderTotal: 300 },
        { orderId: 5, orderDate: '01-01-2024', orderTotal: 150 }
    ];

    try {
        const processed = processOrders(orders);
        const filtered = filterOrders(processed, '2023-11-01', '2023-12-31');
        console.log(filtered);
    } catch (error) {
        console.error('Error processing orders:', error.message);
    }
}

module.exports = { 
    parseDate, 
    sortByDate, 
    sortByTotal, 
    convertDateFormat, 
    processOrders, 
    filterOrders 
};