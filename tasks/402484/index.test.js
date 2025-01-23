const fs = require('fs');
const axios = require('axios');
const { processOrder } = require(process.env.TARGET_FILE);

jest.mock('fs', () => ({
    writeFile: jest.fn(),
    promises: {
        writeFile: jest.fn()
    }
}));
jest.mock('axios');
jest.setTimeout(15000);

describe('processOrder', () => {

    let consoleLogSpy;
    let consoleErrorSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    test('should process order successfully', async () => {
      const orderId = 123;
      const orderData = { customerId: 456, items: [{ id: 1, name: 'item1' }], totalPrice: 100 };
      const customerData = { credit: 200 };
  
      axios.get.mockImplementation((url) => {
          if (url.includes('orders')) {
              return Promise.resolve({ data: orderData });
          } else if (url.includes('customers')) {
              return Promise.resolve({ data: customerData });
          } else if (url.includes('complete')) {
              return Promise.resolve();
          }
      });

      axios.mockImplementation(({ method, url }) => {
        if (method === 'GET' && url.includes('orders')) {
            return Promise.resolve({ data: orderData });
        } else if (method === 'GET' && url.includes('customers')) {
            return Promise.resolve({ data: customerData });
        } else if (method === 'POST' && url.includes('complete')) {
            return Promise.resolve();
        }
      });
  
      fs.writeFile.mockImplementation((path, data, callback) => {
          callback(null);
      });

      fs.promises.writeFile.mockImplementation((path, data) => {
        return Promise.resolve();
      });
  
      const result = await processOrder(orderId);
      expect(result).toBe('Order processing completed successfully!');
  });

    test('should return error for invalid order data', async () => {
        const orderId = 123;
        const orderData = { customerId: 456, items: [], totalPrice: 100 };

        axios.get.mockResolvedValue({ data: orderData });
        axios.mockResolvedValue({ data: orderData });

        try {
            await processOrder(orderId);
        } catch (err) {
            expect(err).toEqual(new Error('Invalid order data.'));
        }
    });

    test('should return error for insufficient credit', async () => {
        const orderId = 123;
        const orderData = { customerId: 456, items: [{ id: 1, name: 'item1' }], totalPrice: 100 };
        const customerData = { credit: 50 };

        axios.get.mockImplementation((url) => {
            if (url.includes('orders')) {
                return Promise.resolve({ data: orderData });
            } else if (url.includes('customers')) {
                return Promise.resolve({ data: customerData });
            }
        });

        axios.mockImplementation(({ method, url }) => {
            if (method === 'GET' && url.includes('orders')) {
                return Promise.resolve({ data: orderData });
            } else if (method === 'GET' && url.includes('customers')) {
                return Promise.resolve({ data: customerData });
            }
        });

        try {
            await processOrder(orderId);
        } catch (err) {
            expect(err).toEqual(new Error('Insufficient credit.'));
        }

    });

    test('should return error if writing to file fails', async () => {
        const orderId = 123;
        const orderData = { customerId: 456, items: [{ id: 1, name: 'item1' }], totalPrice: 100 };
        const customerData = { credit: 200 };

        axios.get.mockImplementation((url) => {
            if (url.includes('orders')) {
                return Promise.resolve({ data: orderData });
            } else if (url.includes('customers')) {
                return Promise.resolve({ data: customerData });
            }
        });

        axios.mockImplementation(({ method, url }) => {
            if (method === 'GET' && url.includes('orders')) {
                return Promise.resolve({ data: orderData });
            } else if (method === 'GET' && url.includes('customers')) {
                return Promise.resolve({ data: customerData });
            }
        });

        fs.writeFile.mockImplementation((path, data, callback) => {
            callback(new Error('Failed to write file'));
        });

        fs.promises.writeFile.mockImplementation((path, data) => {
            return Promise.reject(new Error('Failed to write file'));
        });

        try {
            await processOrder(orderId);
        } catch (err) {
            expect(err).toEqual(new Error('Failed to write file'));
        }

    });
});