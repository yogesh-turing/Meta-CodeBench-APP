class InvoiceSystem {
    constructor() {
      this.state = {
        invoices: [],     
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
          };
          updatedInvoices.push(newInvoice);
        } 
      } 
      
      this.state.invoices = updatedInvoices;
    }
  
  
    printInvoices() {
      return this.state.invoices;
    }
  }
  
 
  
  module.exports = { InvoiceSystem };