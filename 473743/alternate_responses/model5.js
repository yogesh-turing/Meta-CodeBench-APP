class PaymentSystem {
  constructor() {
    this.transactions = [];
    this.nextTransactionId = 1;
    this.exchangeRates = new Map([
      ["USD", 1],
      ["EUR", 0.85],
      ["GBP", 0.73],
      ["JPY", 110.0],
    ]);
    this.paymentMethods = new Map([
      ["CREDIT_CARD", { fee: 0.029, fixedFee: 0.3 }],
      ["DEBIT_CARD", { fee: 0.015, fixedFee: 0.2 }],
      ["BANK_TRANSFER", { fee: 0.005, fixedFee: 0.5 }],
      ["CRYPTO", { fee: 0.01, fixedFee: 0 }],
    ]);
  }

  calculateFees(amount, paymentMethod) {
    const method = this.paymentMethods.get(paymentMethod);
    if (!method) {
      throw new Error("Invalid payment method");
    }
    const percentageFee = amount * method.fee;
    return {
      percentageFee,
      fixedFee: method.fixedFee,
      totalFee: percentageFee + method.fixedFee,
    };
  }

  convertCurrency(amount, fromCurrency, toCurrency) {
    if (
      !this.exchangeRates.has(fromCurrency) ||
      !this.exchangeRates.has(toCurrency)
    ) {
      throw new Error("Unsupported currency");
    }
    const fromRate = this.exchangeRates.get(fromCurrency);
    const toRate = this.exchangeRates.get(toCurrency);
    return Number(((amount / fromRate) * toRate).toFixed(2));
  }

  async processPayment(amount, options = {}) {
    const {
      currency = "USD",
      paymentMethod = "CREDIT_CARD",
      description = "",
      metadata = {},
    } = options;

    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    const usdAmount =
      currency === "USD"
        ? amount
        : this.convertCurrency(amount, currency, "USD");

    const fees = this.calculateFees(usdAmount, paymentMethod);

    const transaction = {
      id: this.nextTransactionId++,
      type: 'payment',
      amount,
      currency,
      paymentMethod,
      description,
      metadata,
      fees,
      amountWithFees:
        amount + this.convertCurrency(fees.totalFee, "USD", currency),
      status: "pending",
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (metadata.shouldFail) {
      transaction.status = "failed";
      transaction.error = "Payment validation failed";
    } else {
      transaction.status = "completed";
    }

    transaction.lastUpdated = new Date().toISOString();
    this.transactions.push(transaction);
    return transaction;
  }

  async refundPayment(transactionId, refundAmount) {
    const originalTransaction = this.getTransaction(transactionId);
    
    if (!originalTransaction) {
      throw new Error("Transaction not found");
    }

    if (originalTransaction.status !== "completed") {
      throw new Error("Only completed transactions can be refunded");
    }

    if (originalTransaction.type === "refund") {
      throw new Error("Cannot refund a refund transaction");
    }

    const maxRefundAmount = originalTransaction.amount;
    const actualRefundAmount = refundAmount || maxRefundAmount;

    if (actualRefundAmount <= 0 || actualRefundAmount > maxRefundAmount) {
      throw new Error("Invalid refund amount");
    }

    const refundTransaction = {
      id: this.nextTransactionId++,
      type: 'refund',
      originalTransactionId: transactionId,
      amount: actualRefundAmount,
      currency: originalTransaction.currency,
      timestamp: new Date().toISOString(),
      status: "pending",
      lastUpdated: new Date().toISOString()
    };

    await new Promise((resolve) => setTimeout(resolve, 100));
    
    refundTransaction.status = "completed";
    refundTransaction.lastUpdated = new Date().toISOString();
    
    this.transactions.push(refundTransaction);
    return refundTransaction;
  }

  calculateTotalRevenue(options = {}) {
    const {
      currency = "USD",
      startDate = null,
      endDate = null,
      includeFailedTransactions = false,
      includeFees = false
    } = options;

    let filteredTransactions = this.transactions;

    // Filter by date range if specified
    if (startDate && endDate) {
      filteredTransactions = this.getTransactionsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    }

    // Filter by status if failed transactions should be excluded
    if (!includeFailedTransactions) {
      filteredTransactions = filteredTransactions.filter(
        t => t.status === "completed"
      );
    }

    const revenue = filteredTransactions.reduce((total, transaction) => {
      let amount = 0;
      
      if (transaction.type === 'payment') {
        amount = includeFees ? transaction.amountWithFees : transaction.amount;
      } else if (transaction.type === 'refund') {
        amount = -transaction.amount; // Subtract refunds from revenue
      }

      // Convert amount to target currency if needed
      if (transaction.currency !== currency) {
        amount = this.convertCurrency(
          amount,
          transaction.currency,
          currency
        );
      }

      return total + amount;
    }, 0);

    return Number(revenue.toFixed(2));
  }

  getTransaction(transactionId) {
    return this.transactions.find((t) => t.id === transactionId) || null;
  }

  getTransactionsByStatus(status) {
    return this.transactions.filter((t) => t.status === status);
  }

  getTransactionsByDateRange(startDate, endDate) {
    return this.transactions.filter((t) => {
      const timestamp = new Date(t.timestamp);
      const afterStart = timestamp >= startDate;
      const beforeEnd = timestamp <= endDate;
      return afterStart && beforeEnd;
    });
  }

  getTransactionsByPaymentMethod(paymentMethod) {
    return this.transactions.filter((t) => t.paymentMethod === paymentMethod);
  }

  getSupportedPaymentMethods() {
    return Array.from(this.paymentMethods.keys());
  }

  getSupportedCurrencies() {
    return Array.from(this.exchangeRates.keys());
  }
}

module.exports = { PaymentSystem };