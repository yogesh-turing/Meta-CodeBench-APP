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
          expiryDate: this.generateExpiryDate(),
        };
        updatedInvoices.push(newInvoice);
      } else if (this.state.rejectionCounts[id] >= 2) {
        const lastRejectionTime = this.state.lastRejectionTime[id];
        if (
          lastRejectionTime &&
          new Date() - new Date(lastRejectionTime) < 24 * 60 * 60 * 1000
        ) {
          console.log(
            `Payer ${buyer} has rejected invoices twice. No new invoices can be sent until 24 hours pass.`
          );
          return;
        }
      }
    } else if (action === "accept" || action === "decline") {
      updatedInvoices = updatedInvoices.map((invoice) => {
        if (invoice.id === payload.id) {
          if (
            action === "accept" &&
            new Date() < new Date(invoice.expiryDate)
          ) {
            return { ...invoice, status: "accepted" };
          } else if (action === "decline") {
            if (invoice.status === "accepted") {
              return { ...invoice };
            }

            this.state.rejectionCounts[invoice.id] =
              (this.state.rejectionCounts[invoice.id] || 0) + 1;
            this.state.lastRejectionTime[invoice.id] = new Date();

            return { ...invoice, status: "declined" };
          }
        }
        return invoice;
      });
    }

    if (action === "checkExpiry") {
      updatedInvoices = updatedInvoices.map((invoice) =>
        new Date() > new Date(invoice.expiryDate) &&
        invoice.status === "pending"
          ? { ...invoice, status: "expired" }
          : invoice
      );
    }

    this.state.invoices = updatedInvoices;
  }

  generateExpiryDate() {
    const days = 5;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate.toISOString();
  }

  printInvoices() {
    return this.state.invoices;
  }
}

const PaymentInvoice = new InvoiceSystem();

PaymentInvoice.handlePaymentAction("send", {
  buyer: "Bob",
  amount: 500,
  description: "Service B",
});
PaymentInvoice.handlePaymentAction("send", {
  buyer: "Bob",
  amount: 200,
  description: "Service B",
});
//PaymentInvoice.handlePaymentAction("send", {
//   buyer: "Bob",
//   amount: 300,
//   description: "Service B",
// });
console.log(PaymentInvoice.state.invoices);
const invoiceID2 = PaymentInvoice.state.invoices[1].id;
// PaymentInvoice.handlePaymentAction("accept", { id: invoiceID2 });
PaymentInvoice.handlePaymentAction("decline", { id: invoiceID2 });
// PaymentInvoice.handlePaymentAction("decline", { id: invoiceID2 });
// PaymentInvoice.handlePaymentAction("send", {
//   buyer: "Bob",
//   amount: 100,
//   description: "Service B",
// });

module.exports = { InvoiceSystem };
