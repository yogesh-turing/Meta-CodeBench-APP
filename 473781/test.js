const {
  parseDate,
  sortByDate,
  sortByTotal,
  convertDateFormat,
  processOrders,
  filterOrders
} = require('./solution.js'); // replace with the actual module filename

describe('Order Processing Functions', () => {
  
  describe('parseDate', () => {
    test('should correctly parse DD-MM-YYYY format', () => {
      const d = parseDate('25-12-2023');
      expect(d.getFullYear()).toBe(2023);
      expect(d.getMonth()).toBe(11); // zero-indexed months (December)
      expect(d.getDate()).toBe(25);
    });

    test('should correctly parse YYYY-MM-DD format', () => {
      const d = parseDate('2023-10-05');
      expect(d.getFullYear()).toBe(2023);
      expect(d.getMonth()).toBe(9); // October is month 9 in zero-indexed format
      expect(d.getDate()).toBe(5);
    });

    test('should correctly parse MM/DD/YYYY format', () => {
      const d = parseDate('05/09/2023');
      expect(d.getFullYear()).toBe(2023);
      expect(d.getMonth()).toBe(4); // May is month 4 in zero-indexed format
      expect(d.getDate()).toBe(9);
    });
  });

  describe('sortByDate', () => {
    test('should sort orders by date from oldest to newest', () => {
      const orders = [
        { orderId: 1, orderDate: '25-12-2023', orderTotal: 100.50 },
        { orderId: 2, orderDate: '12-11-2023', orderTotal: 200 },
        { orderId: 3, orderDate: '2023-10-05', orderTotal: 50 }
      ];
      const sorted = sortByDate([...orders]);
      const dates = sorted.map(o => parseDate(o.orderDate).getTime());
      // Check that dates are in ascending order
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i + 1]);
      }
    });
  });

  describe('sortByTotal', () => {
    test('should sort orders by orderTotal numerically even if values are strings', () => {
      const orders = [
        { orderId: 1, orderTotal: '100.50' },
        { orderId: 2, orderTotal: 200 },
        { orderId: 3, orderTotal: 50 }
      ];
      const sorted = sortByTotal([...orders]);
      const totals = sorted.map(o => Number(o.orderTotal));
      for (let i = 0; i < totals.length - 1; i++) {
        expect(totals[i]).toBeLessThanOrEqual(totals[i + 1]);
      }
    });
  });

  describe('convertDateFormat', () => {
    test("should convert a valid date to 'YYYY-MM-DD' format", () => {
      const formatted = convertDateFormat('2023-10-05');
      // Expect year-month-day with proper zero-padding for month/day if needed.
      // Adjust expectations based on how you handle padding.
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      expect(formatted).toMatch(regex);
    });
  });

  describe('processOrders', () => {
    test('should process orders without iterating one time too many', () => {
      const orders = [
        { orderId: 1, orderDate: '25-12-2023', orderTotal: 100.50 },
        { orderId: 2, orderDate: '12-11-2023', orderTotal: 200 },
        { orderId: 3, orderDate: '2023-10-05', orderTotal: 50 }
      ];
      const processed = processOrders([...orders]);
      // Ensure that the number of processed orders equals the input count
      expect(processed.length).toBe(orders.length);
      // And that each order now has a 'convertedDate' property in correct format
      processed.forEach(order => {
        expect(order).toHaveProperty('convertedDate');
        expect(order.convertedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe('filterOrders', () => {
    test('should filter orders strictly within the provided date range', () => {
      const orders = [
        { orderId: 1, orderDate: '2023-10-05', orderTotal: 50 },
        { orderId: 2, orderDate: '2023-11-15', orderTotal: 200 },
        { orderId: 3, orderDate: '2023-12-20', orderTotal: 150 },
        { orderId: 4, orderDate: '2024-01-05', orderTotal: 300 }
      ];
      const startDate = '2023-11-01';
      const endDate = '2023-12-31';
      const filtered = filterOrders(orders, startDate, endDate);
      // Only orders with dates between start and end (inclusive) should be returned.
      expect(filtered.length).toBe(2);
      filtered.forEach(order => {
        const orderTime = new Date(order.orderDate).getTime();
        expect(orderTime).toBeGreaterThanOrEqual(new Date(startDate).getTime());
        expect(orderTime).toBeLessThanOrEqual(new Date(endDate).getTime());
      });
    });
  });
});