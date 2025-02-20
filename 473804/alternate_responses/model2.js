class InvoiceSystem {
  constructor() {
    this.state = {
      invoices: [],
    };
    this.rejectionCounts = {};
    this.lastRejectionTime = {};

    this.handlePaymentAction = this.handlePaymentAction.bind(this);
    this.generateExpiryDate = this.generateExpiryDate.bind(this);
  }

  generateExpiryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  }

  handlePaymentAction(action, payload = {}) {
    let updatedInvoices = [...this.state.invoices];

    if (action === "send") {
      const { buyer, amount, description, id } = payload;
      const existingInvoice = updatedInvoices.find(
        (invoice) => invoice.id === id
      );

      if (!existingInvoice) {
        const currentTime = new Date();
        const rejectionCount = this.rejectionCounts[id] || 0;
        const lastRejection = this.lastRejectionTime[id];

        if (
          rejectionCount >= 2 &&
          lastRejection &&
          currentTime - lastRejection < 24 * 60 * 60 * 1000
        ) {
          throw new Error("Cannot send invoice: Too many recent rejections");
        }

        const newInvoice = {
          id: id || Date.now(),
          buyer,
          amount,
          description,
          status: "pending",
          expiryDate: this.generateExpiryDate(),
        };
        updatedInvoices.push(newInvoice);
      }
    } else if (action === "accept") {
      const { id } = payload;
      const invoiceIndex = updatedInvoices.findIndex(
        (invoice) => invoice.id === id
      );
      if (invoiceIndex !== -1 && updatedInvoices[invoiceIndex].status === "pending") {
        updatedInvoices[invoiceIndex] = {
          ...updatedInvoices[invoiceIndex],
          status: "accepted",
        };
      }
    } else if (action === "decline") {
      const { id } = payload;
      const invoiceIndex = updatedInvoices.findIndex(
        (invoice) => invoice.id === id
      );
      if (invoiceIndex !== -1 && updatedInvoices[invoiceIndex].status === "pending") {
        updatedInvoices[invoiceIndex] = {
          ...updatedInvoices[invoiceIndex],
          status: "declined",
        };
        
        this.rejectionCounts[id] = (this.rejectionCounts[id] || 0) + 1;
        this.lastRejectionTime[id] = new Date();
      }
    } else if (action === "checkExpiry") {
      const currentTime = new Date();
      updatedInvoices = updatedInvoices.map((invoice) => {
        if (
          invoice.status === "pending" &&
          currentTime > new Date(invoice.expiryDate)
        ) {
          return { ...invoice, status: "expired" };
        }
        return invoice;
      });
    }

    this.state.invoices = updatedInvoices;
  }

  printInvoices() {
    return this.state.invoices;
  }
}

module.exports = { InvoiceSystem };