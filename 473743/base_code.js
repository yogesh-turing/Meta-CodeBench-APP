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
    return (amount / fromRate) * toRate;
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

    // Convert to USD for fee calculation
    const usdAmount =
      currency === "USD"
        ? amount
        : this.convertCurrency(amount, currency, "USD");

    // Calculate fees
    const fees = this.calculateFees(usdAmount, paymentMethod);

    const transaction = {
      id: this.nextTransactionId++,
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

    // Simulate async payment processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simulate payment validation
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