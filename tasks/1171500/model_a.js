const R = require("ramda");

class InventoryManagementSystem {
  constructor() {
    this.products = [];
  }

  validateString(value, fieldName) {
    if (typeof value !== "string") {
      throw new Error("Invalid product details");
    }
  }

  validateNumber(value, fieldName) {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("Invalid product details");
    }
  }

  addProduct(productId, name, description, quantity, price) {
    this.validateString(productId, "productId");
    this.validateString(name, "name");
    this.validateString(description, "description");
    this.validateNumber(quantity, "quantity");
    this.validateNumber(price, "price");

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
    this.validateString(productId, "productId");
    this.validateNumber(quantity, "quantity");

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
    this.validateString(productId, "productId");
    this.validateNumber(discountPercentage, "discountPercentage");

    const productIndex = R.findIndex(
      R.propEq(productId, "productId"),
      this.products
    );

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Invalid discount percentage");
    }

    const product = this.products[productIndex];
    product.price = product.price - (product.price * discountPercentage) / 100;
  }

  getProductById(productId) {
    this.validateString(productId, "productId");

    const product = R.find(R.propEq(productId, "productId"), this.products);

    if (!product) {
      throw new Error("Product not found");
    }

    return { ...product };
  }

  generateStockReport() {
    return this.products.map(product => ({
      productId: product.productId,
      name: product.name,
      quantity: product.quantity,
      price: product.price
    }));
  }

  deleteProduct(productId) {
    this.validateString(productId, "productId");

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
    this.validateNumber(threshold, "threshold");

    const lowStockProducts = this.products.filter(
      product => product.quantity < threshold
    );

    if (lowStockProducts.length === 0) {
      return "No low stock products";
    }

    return lowStockProducts.map(product => ({
      productId: product.productId,
      name: product.name,
      quantity: product.quantity,
      price: product.price
    }));
  }
}

module.exports = { InventoryManagementSystem };