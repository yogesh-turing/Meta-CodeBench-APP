const R = require("ramda");

class InventoryManagementSystem {
  constructor() {
    this.products = [];
  }

  // Helper function to validate inputs
  static validateInputs(types, ...values) {
    for (let i = 0; i < values.length; i++) {
      if (typeof values[i] !== types[i]) {
        throw new Error("Invalid product details");
      }
    }
  }

  addProduct(productId, name, description, quantity, price) {
    // Validate input types
    InventoryManagementSystem.validateInputs(
      ["string", "string", "string", "number", "number"],
      productId,
      name,
      description,
      quantity,
      price
    );

    // Ensure non-negative quantity and price
    if (quantity < 0 || price < 0) {
      throw new Error("Quantity and price must be non-negative");
    }

    const product = {
      productId,
      name,
      description,
      quantity,
      price,
    };

    this.products.push(product);
  }

  updateProductQuantity(productId, quantity) {
    // Validate input types
    InventoryManagementSystem.validateInputs(["string", "number"], productId, quantity);

    const productIndex = R.findIndex(
      R.propEq("productId", productId),
      this.products
    );

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    if (quantity < 0) {
      throw new Error("Quantity must be a non-negative number");
    }

    this.products[productIndex].quantity = quantity;
  }

  applyDiscount(productId, discountPercentage) {
    // Validate input types
    InventoryManagementSystem.validateInputs(["string", "number"], productId, discountPercentage);

    const productIndex = R.findIndex(
      R.propEq("productId", productId),
      this.products
    );

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Invalid discount percentage");
    }

    const product = this.products[productIndex];
    product.price -= (product.price * discountPercentage) / 100;
  }

  getProductById(productId) {
    // Validate input type
    InventoryManagementSystem.validateInputs(["string"], productId);

    const product = R.find(R.propEq("productId", productId), this.products);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  generateStockReport() {
    return R.map(
      R.pick(["productId", "name", "quantity", "price"]),
      this.products
    );
  }

  deleteProduct(productId) {
    // Validate input type
    InventoryManagementSystem.validateInputs(["string"], productId);

    const productIndex = R.findIndex(
      R.propEq("productId", productId),
      this.products
    );

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    this.products.splice(productIndex, 1);
  }

  getLowStockProducts(threshold) {
    // Validate input type
    InventoryManagementSystem.validateInputs(["number"], threshold);

    const lowStockProducts = R.filter(
      R.propSatisfies(R.lt(R.__, threshold), "quantity"),
      this.products
    );

    if (lowStockProducts.length === 0) {
      return "No low stock products";
    }

    return R.map(R.pick(["productId", "name", "quantity"]), lowStockProducts);
  }
}

module.exports = { InventoryManagementSystem };