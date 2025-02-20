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

        // Check if invoice can be sent after being declined twice in the last 24hrs
        if (this.state.rejectionCounts[id] >= 2 && this.state.lastRejectionTime[id] > Date.now() - 24 * 60 * 60 * 1000) {
          throw new Error("Invoice cannot be sent after being declined twice in the last 24hrs");
        }

        updatedInvoices.push(newInvoice);
      }
    } else if (action === "accept") {
      const { id } = payload;
      const invoice = updatedInvoices.find((invoice) => invoice.id === id);

      if (invoice && invoice.status === "pending") {
        invoice.status = "accepted";
      }
    } else if (action === "decline") {
      const { id } = payload;
      const invoice = updatedInvoices.find((invoice) => invoice.id === id);

      if (invoice && invoice.status === "pending") {
        invoice.status = "declined";
        this.state.rejectionCounts[id] = (this.state.rejectionCounts[id] || 0) + 1;
        this.state.lastRejectionTime[id] = Date.now();
      }
    } else if (action === "checkExpiry") {
      updatedInvoices.forEach((invoice) => {
        if (invoice.status === "pending" && invoice.expiryDate < Date.now()) {
          invoice.status = "expired";
        }
      });
    }

    this.state.invoices = updatedInvoices;
  }

  generateExpiryDate() {
    return Date.now() + 5 * 24 * 60 * 60 * 1000;
  }

  printInvoices() {
    return this.state.invoices;
  }
}

module.exports = { InvoiceSystem };