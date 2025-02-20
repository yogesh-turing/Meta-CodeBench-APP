function parseDate(dateStr) {
    // Handle different date formats
    const formats = [
        /^(\d{2})-(\d{2})-(\d{4})$/,  // DD-MM-YYYY
        /^(\d{4})-(\d{2})-(\d{2})$/,  // YYYY-MM-DD
        /^(\d{2})\/(\d{2})\/(\d{4})$/ // DD/MM/YYYY
    ];

    for (let format of formats) {
        const match = dateStr.match(format);
        if (match) {
            if (format.source.startsWith('^(\\d{4})')) {
                // YYYY-MM-DD format
                return new Date(match[1], parseInt(match[2]) - 1, match[3]);
            } else {
                // DD-MM-YYYY or DD/MM/YYYY format
                return new Date(match[3], parseInt(match[2]) - 1, match[1]);
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
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
}

function processOrders(orders) {
    if (!Array.isArray(orders) || orders.length === 0) {
        return [];
    }

    const sortedByDate = sortByDate(orders);
    const sortedByTotal = sortByTotal(orders);
    const processedOrders = [];

    for (let i = 0; i < sortedByDate.length; i++) {
        const order = { ...sortedByDate[i] };
        order.convertedDate = convertDateFormat(order.orderDate);
        order.orderTotal = Number(order.orderTotal);
        processedOrders.push(order);
    }
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