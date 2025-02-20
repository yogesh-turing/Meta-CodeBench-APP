class InvoiceSystem {
  constructor() {
    this.state = {
      invoices: [],
      rejectionCounts: {},
      lastRejectionTime: {},
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
          expiryDate: this.generateExpiryDate(),
        };

        // Check if the invoice has been declined twice in the last 24 hours
        if (
          this.state.rejectionCounts[id] >= 2 &&
          Date.now() - this.state.lastRejectionTime[id] < 24 * 60 * 60 * 1000
        ) {
          console.log("Invoice cannot be sent as it has been declined twice in the last 24 hours");
          return;
        }

        updatedInvoices.push(newInvoice);
      }
    } else if (action === "accept") {
      const { id } = payload;
      const invoiceIndex = updatedInvoices.findIndex((invoice) => invoice.id === id);

      if (invoiceIndex !== -1) {
        updatedInvoices[invoiceIndex].status = "accepted";
      }
    } else if (action === "decline") {
      const { id } = payload;
      const invoiceIndex = updatedInvoices.findIndex((invoice) => invoice.id === id);

      if (invoiceIndex !== -1 && updatedInvoices[invoiceIndex].status !== "accepted") {
        updatedInvoices[invoiceIndex].status = "declined";

        // Update rejection counts and last rejection time
        this.state.rejectionCounts[id] = (this.state.rejectionCounts[id] || 0) + 1;
        this.state.lastRejectionTime[id] = Date.now();
      }
    } else if (action === "checkExpiry") {
      const today = new Date();
      updatedInvoices.forEach((invoice) => {
        if (invoice.status === "pending" && new Date(invoice.expiryDate) < today) {
          invoice.status = "expired";
        }
      });
    }

    this.state.invoices = updatedInvoices;
  }

  generateExpiryDate() {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    return today.toISOString();
  }

  printInvoices() {
    return this.state.invoices;
  }
}

module.exports = { InvoiceSystem };