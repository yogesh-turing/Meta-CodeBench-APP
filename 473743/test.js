const { PaymentSystem } = require('./solution');

describe('PaymentSystem', () => {
  let paymentSystem;

  beforeEach(() => {
    paymentSystem = new PaymentSystem();
    // Mock Date to return a fixed UTC timestamp for testing
    const mockDate = new Date('2025-01-31T05:33:46.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(paymentSystem.transactions).toEqual([]);
      expect(paymentSystem.nextTransactionId).toBe(1);
      expect(paymentSystem.exchangeRates.size).toBe(4);
      expect(paymentSystem.paymentMethods.size).toBe(4);
    });
  });

  describe('calculateFees', () => {
    it('should calculate fees correctly for credit card', () => {
      const result = paymentSystem.calculateFees(100, 'CREDIT_CARD');
      expect(result).toEqual({
        percentageFee: 2.9,
        fixedFee: 0.3,
        totalFee: 3.2
      });
    });

    it('should throw error for invalid payment method', () => {
      expect(() => paymentSystem.calculateFees(100, 'INVALID')).toThrow('Invalid payment method');
    });
  });

  describe('convertCurrency', () => {
    it('should convert currency correctly', () => {
      const result = paymentSystem.convertCurrency(100, 'USD', 'EUR');
      expect(result).toBe(85);
    });

    it('should throw error for unsupported currency', () => {
      expect(() => paymentSystem.convertCurrency(100, 'USD', 'XXX')).toThrow('Unsupported currency');
    });
  });

  describe('processPayment', () => {
    it('should process payment successfully with default options', async () => {
      const transaction = await paymentSystem.processPayment(100);
      expect(transaction).toMatchObject({
        id: 1,
        amount: 100,
        currency: 'USD',
        paymentMethod: 'CREDIT_CARD',
        status: 'completed',
        timestamp: '2025-01-31T05:33:46.000Z',
        lastUpdated: '2025-01-31T05:33:46.000Z'
      });
    });

    it('should process payment with custom options', async () => {
      const options = {
        currency: 'EUR',
        paymentMethod: 'BANK_TRANSFER',
        description: 'Test payment',
        metadata: { orderId: '123' }
      };
      const transaction = await paymentSystem.processPayment(100, options);
      expect(transaction).toMatchObject({
        currency: 'EUR',
        paymentMethod: 'BANK_TRANSFER',
        description: 'Test payment',
        metadata: { orderId: '123' }
      });
    });

    it('should fail payment when metadata.shouldFail is true', async () => {
      const transaction = await paymentSystem.processPayment(100, {
        metadata: { shouldFail: true }
      });
      expect(transaction.status).toBe('failed');
      expect(transaction.error).toBe('Payment validation failed');
    });

    it('should throw error for invalid amount', async () => {
      await expect(paymentSystem.processPayment(0)).rejects.toThrow('Invalid amount');
      await expect(paymentSystem.processPayment(-100)).rejects.toThrow('Invalid amount');
    });
  });

  describe('transaction queries', () => {
    beforeEach(async () => {
      await paymentSystem.processPayment(100, { paymentMethod: 'CREDIT_CARD' });
      await paymentSystem.processPayment(200, { 
        paymentMethod: 'DEBIT_CARD',
        metadata: { shouldFail: true }
      });
    });

    it('should get transaction by id', () => {
      const transaction = paymentSystem.getTransaction(1);
      expect(transaction).toBeTruthy();
      expect(transaction.id).toBe(1);
    });

    it('should return null for non-existent transaction', () => {
      const transaction = paymentSystem.getTransaction(999);
      expect(transaction).toBeNull();
    });

    it('should get transactions by status', () => {
      const completed = paymentSystem.getTransactionsByStatus('completed');
      const failed = paymentSystem.getTransactionsByStatus('failed');
      expect(completed).toHaveLength(1);
      expect(failed).toHaveLength(1);
    });

    it('should get transactions by date range', () => {
      const startDate = new Date('2025-01-31T00:00:00.000Z');
      const endDate = new Date('2025-01-31T23:59:59.999Z');
      const transactions = paymentSystem.getTransactionsByDateRange(startDate, endDate);
      expect(transactions).toHaveLength(2);
    });

    it('should get transactions by payment method', () => {
      const creditCardTransactions = paymentSystem.getTransactionsByPaymentMethod('CREDIT_CARD');
      const debitCardTransactions = paymentSystem.getTransactionsByPaymentMethod('DEBIT_CARD');
      expect(creditCardTransactions).toHaveLength(1);
      expect(debitCardTransactions).toHaveLength(1);
    });
  });

  describe('supported methods and currencies', () => {
    it('should return all supported payment methods', () => {
      const methods = paymentSystem.getSupportedPaymentMethods();
      expect(methods).toEqual(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CRYPTO']);
    });

    it('should return all supported currencies', () => {
      const currencies = paymentSystem.getSupportedCurrencies();
      expect(currencies).toEqual(['USD', 'EUR', 'GBP', 'JPY']);
    });
  });
});