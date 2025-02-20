class InvoiceSystem {
  constructor() {
    this.state = {
      invoices: [],
      rejectionCounts: {},
      lastRejectionTime: {}
    };

    this.handlePaymentAction = this.handlePaymentAction.bind(this);
    this.generateExpiryDate = this.generateExpiryDate.bind(this);
  }

  handlePaymentAction(action, payload = {}) {
    let updatedInvoices = [...this.state.invoices];

    if (action === "send") {
      const { buyer, amount, description, id } = payload;

      const existingInvoice = updatedInvoices.find(
        (invoice) => invoice.id === id
      );

      if (!existingInvoice) {
        const newInvoice = {
          id: Date.now(),
          buyer,
          amount,
          description,
          status: "pending",
          expiryDate: this.generateExpiryDate()
        };
        updatedInvoices.push(newInvoice);
      }
    } else if (action === "accept" || action === "decline") {
      const { id } = payload;
      const invoice = updatedInvoices.find((invoice) => invoice.id === id);

      if (invoice) {
        if (action === "accept") {
          invoice.status = "accepted";
        } else if (action === "decline") {
          if (invoice.status !== "accepted") {
            invoice.status = "declined";
            this.state.rejectionCounts[id] = (this.state.rejectionCounts[id] || 0) + 1;
            this.state.lastRejectionTime[id] = Date.now();
          }
        }
      }
    } else if (action === "checkExpiry") {
      const now = Date.now();
      updatedInvoices.forEach((invoice) => {
        if (invoice.status === "pending" && invoice.expiryDate < now) {
          invoice.status = "expired";
        }
      });
    }

    this.state.invoices = updatedInvoices;
  }

  generateExpiryDate() {
    const now = Date.now();
    return now + 5 * 24 * 60 * 60 * 1000; // 5 days from now
  }

  canSendInvoice(id) {
    const lastRejectionTime = this.state.lastRejectionTime[id];
    const rejectionCounts = this.state.rejectionCounts[id];

    if (!lastRejectionTime || !rejectionCounts) return true;

    const now = Date.now();
    const timeSinceLastRejection = now - lastRejectionTime;

    if (timeSinceLastRejection < 24 * 60 * 60 * 1000) { // 24 hours
      if (rejectionCounts >= 2) return false;
    }

    return true;
  }

  printInvoices() {
    return this.state.invoices;
  }
}

module.exports = { InvoiceSystem };