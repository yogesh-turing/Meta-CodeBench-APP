const { updateInventory } = require("./alternate_responses/model1");
const notificationService = require("./notificationService");

// Mocking the notificationService
jest.mock("./notificationService", () => ({
  sendNotification: jest.fn(),
}));

describe("updateInventory", () => {
  let mockProducts;

  beforeEach(() => {
    // Resetting mock data before each test
    mockProducts = [
      { id: "1", name: "T-Shirt", stock: 50 },
      { id: "2", name: "Jeans", stock: 25 },
    ];
  });

  it("should update inventory successfully and send a notification", () => {
    const order = {
      orderId: "ORD-123",
      items: [
        { productId: "1", quantity: 2 },
        { productId: "2", quantity: 1 },
      ],
    };

    const result = updateInventory(order, mockProducts);

    expect(result).toEqual({
      success: true,
      message: "Inventory updated successfully",
    });

    expect(mockProducts[0].stock).toBe(48);
    expect(mockProducts[1].stock).toBe(24);

    expect(notificationService.sendNotification).toHaveBeenCalledWith(
      "Inventory updated successfully"
    );
  });

  it("should throw an error if order format is invalid", () => {
    const invalidOrder = {
      orderId: "ORD-123",
    };

    expect(() => updateInventory(invalidOrder, mockProducts)).toThrow(
      "Invalid order format"
    );
  });

  it("should throw an error if product is not found", () => {
    const orderWithUnknownProduct = {
      orderId: "ORD-123",
      items: [{ productId: "3", quantity: 2 }],
    };

    expect(() =>
      updateInventory(orderWithUnknownProduct, mockProducts)
    ).toThrow("Product with id 3 not found");
  });

  it("should throw an error if there is insufficient stock", () => {
    const orderWithInsufficientStock = {
      orderId: "ORD-123",
      items: [{ productId: "1", quantity: 100 }],
    };

    expect(() =>
      updateInventory(orderWithInsufficientStock, mockProducts)
    ).toThrow("Insufficient stock for product with id 1");
  });
});