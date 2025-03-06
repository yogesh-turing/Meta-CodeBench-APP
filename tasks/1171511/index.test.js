const { InventoryManagementSystem } = require("./model_a");
// const { InventoryManagementSystem } = require(process.env.TARGET_FILE);

describe("Inventory Management System", () => {
  let ims;

  beforeEach(() => {
    ims = new InventoryManagementSystem();
  });

  test("should add a product correctly", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    const product = ims.getProductById("1");
    expect(product).toEqual({
      productId: "1",
      name: "Laptop",
      description: "A powerful laptop",
      quantity: 10,
      price: 1000,
    });
  });

  test("should throw error if adding product with invalid details", () => {
    expect(() => ims.addProduct("2", "", "", "1", 1)).toThrow(
      "Invalid product details"
    );
  });

  test("should throw error if adding productid is of invalid type", () => {
    expect(() =>
      ims.addProduct(1, "Laptop", "A powerful laptop", 10, 1000)
    ).toThrow("Invalid product details");
  });

  test("should throw error if product name is of invalid type", () => {
    expect(() =>
      ims.addProduct("1", 123, "A powerful laptop", 10, 1000)
    ).toThrow("Invalid product details");
  });

  test("should throw error if product description is of invalid type", () => {
    expect(() => ims.addProduct("1", "Laptop", 12333, 10, 1000)).toThrow(
      "Invalid product details"
    );
  });

  test("should throw error if product quantity is of invalid type", () => {
    expect(() => ims.addProduct("1", "Laptop", "Laptop", "sa", 1000)).toThrow(
      "Invalid product details"
    );
  });

  test("should throw error if product price is of invalid type", () => {
    expect(() => ims.addProduct("1", "Laptop", "Laptop", 10, "sa")).toThrow(
      "Invalid product details"
    );
  });

  test("should update product quantity correctly", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.updateProductQuantity("1", 20);

    const product = ims.getProductById("1");
    expect(product.quantity).toBe(20);
  });

  test("should throw error if product not found while updating quantity", () => {
    expect(() => ims.updateProductQuantity("non-existing-id", 20)).toThrow(
      "Product not found"
    );
  });

  test("should throw error if trying to update quantity with negative value", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    expect(() => ims.updateProductQuantity("1", -5)).toThrow(
      "Quantity must be a non-negative number"
    );
  });

  test("should throw error if adding productid is of invalid type while updating", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.updateProductQuantity(1, 5)).toThrow(
      "Invalid product details"
    );
  });

  test("should throw error if productid is of invalid type while updating", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.updateProductQuantity(1, "5")).toThrow(
      "Invalid product details"
    );
  });

  test("should apply discount correctly", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.applyDiscount("1", 10);

    const product = ims.getProductById("1");
    expect(product.price).toBe(900); // 1000 - 10% = 900
  });

  test("should throw error if product not found while applying discount", () => {
    expect(() => ims.applyDiscount("non-existing-id", 10)).toThrow(
      "Product not found"
    );
  });

  test("should throw error if discount percentage is invalid", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    expect(() => ims.applyDiscount("1", 110)).toThrow(
      "Invalid discount percentage"
    );
  });

  test("should throw error if productid is of invalid type while discount", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.applyDiscount(1, 110)).toThrow("Invalid product details");
  });

  test("should throw error if discount percentage is of invalid type while discount", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.applyDiscount("1", "110")).toThrow(
      "Invalid product details"
    );
  });

  test("should generate stock report", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.addProduct("2", "Phone", "A smartphone", 20, 500);

    const report = ims.generateStockReport();
    expect(report).toEqual([
      { productId: "1", name: "Laptop", quantity: 10, price: 1000 },
      { productId: "2", name: "Phone", quantity: 20, price: 500 },
    ]);
  });

  test("should delete a product correctly", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.deleteProduct("1");

    expect(() => ims.getProductById("1")).toThrow("Product not found");
  });

  test("should throw an error when product id is of invalid type while deleting", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.deleteProduct(1)).toThrow("Invalid product details");
  });

  test("should throw error if product not found while deleting", () => {
    expect(() => ims.deleteProduct("non-existing-id")).toThrow(
      "Product not found"
    );
  });

  test("should return low stock products", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.addProduct("2", "Phone", "A smartphone", 5, 500);

    const lowStock = ims.getLowStockProducts(10);
    expect(lowStock).toEqual([
      { productId: "2", name: "Phone", quantity: 5, price: 500 },
    ]);
  });

  test("should return empty array for low stock products if none are found", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.addProduct("2", "Phone", "A smartphone", 15, 500);

    const lowStock = ims.getLowStockProducts(5);
    expect(lowStock).toBe("No low stock products");
  });
});