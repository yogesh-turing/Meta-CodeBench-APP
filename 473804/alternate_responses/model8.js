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

      const existingInvoice = updatedInvoices.find((invoice) => invoice.id === id);

      if (!existingInvoice) {
        const newInvoice = {
          id: Date.now(),
          buyer,
          amount,
          description,
          status: "pending",
          expiryDate: this.generateExpiryDate()
        };

        // Check if the buyer has declined an invoice with the same id twice in the last 24 hours
        if (this.state.rejectionCounts[id] >= 2 && this.state.lastRejectionTime[id] > Date.now() - 24 * 60 * 60 * 1000) {
          console.log("Cannot send invoice as it has been declined twice in the last 24 hours");
          return;
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

  printInvoices() {
    return this.state.invoices;
  }
}

module.exports = { InvoiceSystem };