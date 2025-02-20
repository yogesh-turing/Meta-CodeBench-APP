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
    const rejectionCount = this.rejectionCounts[id] || 0;
    const lastRejection = this.lastRejectionTime[id];

    if (rejectionCount >= 2 && lastRejection) {
      const hoursSinceLastRejection = (Date.now() - lastRejection) / (1000 * 60 * 60);
      return hoursSinceLastRejection >= 24;
    }
    return true;
  }

  handlePaymentAction(action, payload = {}) {
    let updatedInvoices = [...this.state.invoices];

    switch (action) {
      case "send": {
        const { buyer, amount, description, id } = payload;
        const existingInvoice = updatedInvoices.find(
          (invoice) => invoice.id === id
        );

        if (!existingInvoice && this.canSendInvoice(id)) {
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
        updatedInvoices = updatedInvoices.map(invoice => 
          invoice.id === id && invoice.status === "pending"
            ? { ...invoice, status: "accepted" }
            : invoice
        );
        break;
      }

      case "decline": {
        const { id } = payload;
        const invoice = updatedInvoices.find(inv => inv.id === id);
        
        if (invoice && invoice.status === "pending") {
          this.rejectionCounts[id] = (this.rejectionCounts[id] || 0) + 1;
          this.lastRejectionTime[id] = Date.now();
          
          updatedInvoices = updatedInvoices.map(invoice =>
            invoice.id === id ? { ...invoice, status: "declined" } : invoice
          );
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