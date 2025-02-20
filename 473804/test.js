const { InvoiceSystem } = require('./solution'); // Replace functionNames with the correct function(s)

describe("InvoiceSystem", () => {
  let invoiceSystem;

  beforeEach(() => {
    invoiceSystem = new InvoiceSystem();
  });


  test("should not change existing invoice when sending with existing ID", () => {
    invoiceSystem.handlePaymentAction("send", {
      buyer: "Alice",
      amount: 300,
      description: "Service A",
    });
    const existingInvoiceId = invoiceSystem.state.invoices[0].id;
    invoiceSystem.handlePaymentAction("send", {
      buyer: "Alice",
      amount: 300,
      description: "Service A",
      id: existingInvoiceId,
    });
    expect(invoiceSystem.state.invoices.length).toBe(1);
  });
  test("should send an invoice correctly", () => {
    invoiceSystem.handlePaymentAction("send", {
      buyer: "Alice",
      amount: 300,
      description: "Web Design",
    });

    expect(invoiceSystem.state.invoices.length).toBe(1);
    expect(invoiceSystem.state.invoices[0]).toMatchObject({
      buyer: "Alice",
      amount: 300,
      description: "Web Design",
      status: "pending",
    });
  });


  test("should allow accepting an invoice before expiry", () => {
    invoiceSystem.handlePaymentAction("send", {
      buyer: "Bob",
      amount: 400,
      description: "Service B",
    });

    const invoiceID = invoiceSystem.state.invoices[0].id;

    invoiceSystem.handlePaymentAction("accept", { id: invoiceID });

    expect(invoiceSystem.state.invoices[0].status).toBe("accepted");
  });

  test("should allow declining an invoice and track rejection count", () => {
    invoiceSystem.handlePaymentAction("send", {
      buyer: "Charlie",
     amount: 250,
      description: "Consulting",
    });

    const invoiceID = invoiceSystem.state.invoices[0].id;

    invoiceSystem.handlePaymentAction("decline", { id: invoiceID });

    expect(invoiceSystem.state.invoices[0].status).toBe("declined");
    expect(invoiceSystem.state.rejectionCounts[invoiceID]).toBe(1);
  });

  test("should prevent resending invoice if rejected twice within 24 hours", () => {
    invoiceSystem.handlePaymentAction("send", {
      buyer: "David",
      amount: 150,
      description: "Development Service",
    });

    const invoiceID = invoiceSystem.state.invoices[0].id;

    invoiceSystem.handlePaymentAction("decline", { id: invoiceID });
    invoiceSystem.handlePaymentAction("decline", { id: invoiceID });

    const spyConsole = jest.spyOn(console, "log").mockImplementation();

    invoiceSystem.handlePaymentAction("send", {
      buyer: "David",
      amount: 200,
      description: "Extra Work",
      id: invoiceID,
    });

    expect(spyConsole).toHaveBeenCalledWith(
      expect.stringContaining("Payer David has rejected invoices twice.")
    );

    spyConsole.mockRestore();
   });

  test("should mark invoice as expired if expiry date is past", () => {
    invoiceSystem.handlePaymentAction("send", {
      buyer: "Eve",
      amount: 500,
      description: "Marketing",
    });

    const invoiceID = invoiceSystem.state.invoices[0].id;
    invoiceSystem.state.invoices[0].expiryDate = new Date(Date.now() - 1000).toISOString();

    invoiceSystem.handlePaymentAction("checkExpiry");

    expect(invoiceSystem.state.invoices[0].status).toBe("expired");
  });

});
describe("Edge Cases", () => {
    let invoiceSystem;
  
    beforeEach(() => {
      invoiceSystem = new InvoiceSystem();
    });

  
    test("should not change invoice status if attempting to decline an accepted invoice", () => {
      invoiceSystem.handlePaymentAction("send", {
        buyer: "Henry",
        amount: 350,
        description: "Digital Marketing",
      });
  
      const invoiceID = invoiceSystem.state.invoices[0].id;
  
      invoiceSystem.handlePaymentAction("accept", { id: invoiceID });
      invoiceSystem.handlePaymentAction("decline", { id: invoiceID });
  
      expect(invoiceSystem.state.invoices[0].status).toBe("accepted"); // Decline should not affect accepted invoices
    });
  
    test("should handle attempting to accept a non-existent invoice", () => {
      const spyConsole = jest.spyOn(console, "log").mockImplementation();
  
      invoiceSystem.handlePaymentAction("accept", { id: 99999 });
  
      expect(spyConsole).not.toHaveBeenCalled(); // Should fail silently without errors
  
      spyConsole.mockRestore();
    });
  
    test("should handle empty invoices gracefully", () => {
      expect(invoiceSystem.state.invoices.length).toBe(0);
      invoiceSystem.handlePaymentAction("checkExpiry");
      expect(invoiceSystem.state.invoices.length).toBe(0); // Should not throw errors
    });
  
    test("should correctly format expiry date", () => {
      invoiceSystem.handlePaymentAction("send", {
        buyer: "Irene",
        amount: 250,
        description: "SEO Optimization",
      });
  
      const invoiceExpiry = new Date(invoiceSystem.state.invoices[0].expiryDate);
      const expectedExpiry = new Date();
      expectedExpiry.setDate(expectedExpiry.getDate() + 5);
  
      expect(invoiceExpiry.getDate()).toBe(expectedExpiry.getDate());
    });
  });