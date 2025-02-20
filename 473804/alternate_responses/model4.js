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

  canSendInvoice(id) {
    const currentTime = Date.now();
    const lastRejection = this.lastRejectionTime[id] || 0;
    const rejectionCount = this.rejectionCounts[id] || 0;

    const timeDifference = currentTime - lastRejection;
    const hoursSinceLastRejection = timeDifference / (1000 * 60 * 60);

    return !(rejectionCount >= 2 && hoursSinceLastRejection < 24);
  }

  handlePaymentAction(action, payload = {}) {
    let updatedInvoices = [...this.state.invoices];

    switch (action) {
      case "send": {
        const { buyer, amount, description, id } = payload;
        const existingInvoice = updatedInvoices.find(
          (invoice) => invoice.id === id
        );

        if (!existingInvoice) {
          if (!this.canSendInvoice(id)) {
            throw new Error("Cannot send invoice: rejection limit exceeded");
          }

          const newInvoice = {
            id: id || Date.now(),
            buyer,
            amount,
            description,
            status: "pending",
            createdAt: new Date(),
            expiryDate: this.generateExpiryDate(),
          };
          updatedInvoices.push(newInvoice);
        }
        break;
      }

      case "accept": {
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
        break;
      }

      case "decline": {
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
          this.lastRejectionTime[id] = Date.now();
        }
        break;
      }

      case "checkExpiry": {
        const currentDate = new Date();
        updatedInvoices = updatedInvoices.map(invoice => {
          if (invoice.status === "pending" && invoice.expiryDate < currentDate) {
            return { ...invoice, status: "expired" };
          }
          return invoice;
        });
        break;
      }
    }

    this.state.invoices = updatedInvoices;
  }

  printInvoices() {
    return this.state.invoices;
  }
}

module.exports = { InvoiceSystem };