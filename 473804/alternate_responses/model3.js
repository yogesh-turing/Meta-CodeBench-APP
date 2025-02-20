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
        const invoiceId = Date.now();
        // Check rejection count and time
        if (this.rejectionCounts[invoiceId] >= 2) {
          const lastRejection = this.lastRejectionTime[invoiceId];
          const timeDiff = Date.now() - lastRejection;
          if (timeDiff < 24 * 60 * 60 * 1000) {
            throw new Error("Cannot send invoice: Too many rejections in 24 hours");
          }
        }

        const newInvoice = {
          id: invoiceId,
          buyer,
          amount,
          description,
          status: "pending",
          expiryDate: this.generateExpiryDate(),
          createdAt: new Date()
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
          status: "accepted"
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
          status: "declined"
        };

        // Update rejection tracking
        this.rejectionCounts[id] = (this.rejectionCounts[id] || 0) + 1;
        this.lastRejectionTime[id] = Date.now();
      }
    } else if (action === "checkExpiry") {
      const currentDate = new Date();
      updatedInvoices = updatedInvoices.map(invoice => {
        if (invoice.status === "pending" && currentDate > invoice.expiryDate) {
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