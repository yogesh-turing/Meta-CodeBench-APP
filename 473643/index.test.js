const yup = require("yup");
const { validate } = require('./solution'); // Adjust path accordingly

describe("Payment Validation Tests", () => {
  test("Should pass for valid PaymentIncoming data", async () => {
    const validPayment = {
      amount: 100,
      paymentDate: new Date(),
      status: 1,
      reason: 0,
      paymentMode: 1,
      description: "Payment for invoice",
      assetID: "asset123",
      paymentType: 0,
      category: "services",
      categoryType: 0,
      invoiceIDs: ["inv001"],
      clientID: "client123",
    };
    await expect(validate(validPayment)).resolves.not.toThrow();
  });

  test("Should fail if amount is missing", async () => {
    const invalidPayment = {
      paymentDate: new Date(),
      paymentType: 0,
      paymentMode: 1,
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Amount is required"]),
    });
  });

  test("Should fail if amount is less than 1", async () => {
    const invalidPayment = {
      amount: 0,
      paymentDate: new Date(),
      paymentType: 0,
      paymentMode: 1,
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Amount must be greater than 0"]),
    });
  });

  test("Should fail if paymentType is missing", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentMode: 1,
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Payment type is required"]),
    });
  });

  test("Should fail if paymentMode is missing", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 1,
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Payment mode is required"]),
    });
  });

  test("Should fail if reason is not 0 or 1", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 0,
      reason: 2, // Invalid value
      paymentMode: 0,
    };
    await expect(validate(invalidPayment)).rejects.toThrow();
  });

  test("Should pass for valid PaymentOutgoing data", async () => {
    const validPayment = {
      amount: 200,
      paymentDate: new Date(),
      status: 1,
      reason: 1,
      paymentMode: 1,
      description: "Vendor payment",
      assetID: "asset456",
      paymentType: 1,
      category: "supplies",
      categoryType: 1,
      orderIDs: ["order001"],
      vendorID: "vendor789",
    };
    await expect(validate(validPayment)).resolves.not.toThrow();
  });

  test("Should fail if orderIDs is required but missing (PaymentOutgoing)", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 1,
      paymentMode: 1,
      reason: 0,
      categoryType: 0,
      vendorID: "vendor001",
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Order ID is required"]),
    });
  });

  test("Should fail if orderIDs is empty (PaymentOutgoing)", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 1,
      paymentMode: 1,
      reason: 0,
      categoryType: 0,
      vendorID: "vendor001",
      orderIDs: [],
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Order ID must include at least one ID"]),
    });
  });

  test("Should fail if vendorID is required but missing (PaymentOutgoing)", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 1,
      paymentMode: 1,
      reason: 0,
      categoryType: 0,
      orderIDs: ["order001"],
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Vendor ID is required"]),
    });
  });

  test("Should fail if invoiceIDs is required but missing (PaymentIncoming)", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 0,
      paymentMode: 0,
      reason: 0,
      categoryType: 0,
      clientID: "client001",
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Invoice ID is required"]),
    });
  });

  test("Should fail if invoiceIDs is empty (PaymentIncoming)", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 0,
      paymentMode: 0,
      reason: 0,
      categoryType: 0,
      clientID: "client001",
      invoiceIDs: [],
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining([
        "Invoice ID must include at least one ID",
      ]),
    });
  });

  test("Should fail if clientID is required but missing (PaymentIncoming)", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 0,
      paymentMode: 0,
      reason: 0,
      categoryType: 0,
      invoiceIDs: ["inv001"],
    };
    await expect(validate(invalidPayment)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Client ID is required"]),
    });
  });

  test("Should fail if categoryType is invalid", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 0,
      paymentMode: 0,
      categoryType: 2, // Invalid
    };
    await expect(validate(invalidPayment)).rejects.toThrow();
  });

  test("Should fail if paymentMode is invalid (PaymentOutgoing)", async () => {
    const invalidPayment = {
      amount: 100,
      paymentDate: new Date(),
      paymentType: 1,
      paymentMode: 3, // Invalid
    };
    await expect(validate(invalidPayment)).rejects.toThrow();
  });
});
